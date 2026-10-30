// Isolated Chromium fixtures render the real templates/CSS; no publication is changed.
const assert = require('node:assert/strict');
const {test, before, after} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const Handlebars = require('handlebars');
const {rgb, contrast} = require('./contrast.cjs');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const css = read('assets/css/screen.css');
const hbs = Handlebars.create();
const site = {title: 'Ghost Research Pro — Fictional demo', url: '/', allow_self_signup: true, members_signup_access: 'all'};
const posts = [{title: 'Fictional report', url: '/report/', custom_excerpt: 'Illustrative content only.'}];
for (const file of fs.readdirSync(path.join(root, 'partials')).filter(file => file.endsWith('.hbs'))) hbs.registerPartial(file.slice(0, -4), read('partials/' + file));
hbs.registerHelper('navigation', () => new hbs.SafeString('<ul>' + ['Home', 'Research', 'Brief', 'Demo Logistics', 'About', 'Membership'].map(label => `<li><a href="#">${label}</a></li>`).join('') + '</ul>'));
hbs.registerHelper('match', function (left, right, options) { return left === right ? options.fn(this) : options.inverse(this); });
hbs.registerHelper('foreach', function (items, options) { return items.length ? items.map(item => options.fn(item)).join('') : options.inverse(this); });
hbs.registerHelper('get', function (resource, options) { return options.fn({[resource]: []}); });
hbs.registerHelper('date', () => '2026-10-30');
hbs.registerHelper('reading_time', () => '1 min read');
hbs.registerHelper('pagination', () => '');
const render = file => hbs.compile(read(file))({posts, tag: {name: 'Research'}, author: {name: 'Analyst'}}, {data: {site}});
const header = hbs.compile(read('default.hbs').match(/<header class="site-header[\s\S]*?<\/header>/)[0])({}, {data: {site}});
let browser;
before(async () => { browser = await chromium.launch({headless: true}); });
after(async () => { await browser?.close(); });
async function pageFor(t, body, width = 1280) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    t.after(() => page.close());
    await page.route('**/*', route => route.abort());
    await page.setContent(`<html lang="en"><head><title>Theme layout fixture</title><style>${css}</style></head><body>${body}</body></html>`);
    return page;
}

test('keyboard focus on ordinary links, anchor buttons and native buttons contrasts with theme surfaces', async t => {
    const page = await pageFor(t, '<main class="wrap"><a href="#">Ordinary link</a><a class="button" href="#">Subscribe</a><button>Native action</button><div class="card"><a href="#">Panel link</a></div></main>');
    for (const control of await page.locator('a,button').all()) {
        await page.keyboard.press('Tab');
        assert.equal(await control.evaluate(el => el === document.activeElement), true);
        const style = await control.evaluate(el => {
            const s = getComputedStyle(el);
            return {color: s.outlineColor, width: parseFloat(s.outlineWidth), style: s.outlineStyle};
        });
        assert.equal(style.style, 'solid');
        assert(style.width >= 3);
        for (const background of ['rgb(255,255,255)', 'rgb(245,248,252)']) {
            assert(contrast(rgb(style.color), rgb(background)) >= 3, `${style.color} fails focus contrast on ${background}`);
        }
    }
});

test('long brand and six navigation links keep actions and navigation labels whole without overlap', async t => {
    for (const width of [1600, 1280, 1024, 801, 800, 390, 320]) {
        const page = await pageFor(t, header + '<main class="wrap"><h1>Body</h1></main>', width);
        for (const size of [16, 32]) {
            await page.addStyleTag({content: `html,body{font-size:${size}px}`});
            const layout = await page.evaluate(() => {
                const header = document.querySelector('header');
                const links = [...header.querySelectorAll('nav a,.member-actions a')].map(el => {
                    const range = document.createRange(); range.selectNodeContents(el);
                    const r = el.getBoundingClientRect();
                    return {text: el.textContent.trim(), lines: range.getClientRects().length, left: r.left, right: r.right, top: r.top, bottom: r.bottom};
                });
                return {width: innerWidth, scrollWidth: document.documentElement.scrollWidth, links, headerBottom: header.getBoundingClientRect().bottom, bodyTop: document.querySelector('main').getBoundingClientRect().top, navTop: header.querySelector('nav').getBoundingClientRect().top, actionBottom: header.querySelector('.member-actions').getBoundingClientRect().bottom};
            });
            assert(layout.scrollWidth <= width, `${width}px/${size}px page overflow`);
            assert(layout.bodyTop >= layout.headerBottom, 'Header overlaps body');
            for (const link of layout.links) {
                assert.equal(link.lines, 1, `${width}px/${size}px ${link.text} wraps internally`);
                assert(link.left >= 0 && link.right <= width, `${link.text} outside viewport`);
                for (const other of layout.links.filter(item => item !== link)) {
                    assert(!(link.left < other.right && link.right > other.left && link.top < other.bottom && link.bottom > other.top), 'Header links overlap');
                }
            }
            if (width === 1280) assert(layout.navTop >= layout.actionBottom, 'Medium-width navigation needs its own row');
        }
    }
});

test('archive cards follow H1 with H2 while homepage cards remain under their H2 section', async t => {
    for (const file of ['index.hbs', 'tag.hbs', 'author.hbs']) {
        const page = await pageFor(t, `<main>${render(file)}</main>`);
        const levels = await page.locator('h1,h2,h3').evaluateAll(nodes => nodes.map(el => Number(el.tagName.slice(1))));
        assert.equal(levels[0], 1);
        for (let i = 1; i < levels.length; i++) assert(levels[i] <= levels[i - 1] + 1, `${file} skips a heading level`);
        if (file === 'index.hbs') {
            assert.equal(await page.locator('#research-library > header h2').textContent(), 'Latest research');
            assert.equal(await page.locator('#research-library .card h3').count(), 1);
        } else assert.equal(await page.locator('.card h2').count(), 1);
        const title = page.locator('.card h2,.card h3');
        assert.equal(await title.locator('a').getAttribute('href'), '/report/');
        assert.equal(await title.evaluate(el => getComputedStyle(el).fontSize), '24px');
    }
});
