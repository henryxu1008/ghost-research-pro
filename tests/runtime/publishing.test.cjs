// Actual theme templates/CSS in Chromium with fictional server-side contexts.
// Real Ghost routing, pagination and access are checked separately by acceptance.cjs.
const assert = require('node:assert/strict');
const {test, before, after} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Handlebars = require('handlebars');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '../..');
const read = name => fs.existsSync(path.join(root, name)) ? fs.readFileSync(path.join(root, name), 'utf8') : '';
const css = read('assets/css/screen.css');
const post = {title: 'Fictional research publication', slug: 'fixture', url: '/fixture/', visibility: 'members', access: false,
    featured: true, custom_excerpt: 'A public-safe fictional summary.', html: 'PRIVATE_BODY_SENTINEL',
    published_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-03T00:00:00Z',
    primary_tag: {name: 'Research', url: '/tag/research/'}, authors: [{name: 'Fictional analyst'}]};
const site = {title: 'Ghost Research Pro — Fictional demo', description: 'Fictional research and briefings.', url: '/', allow_self_signup: true, members_signup_access: 'all', secondary_navigation: [{label: 'Logistics', url: '/tag/logistics/'}]};
function render(file, override = {}) {
    assert(read(file), `Missing runtime template ${file}`);
    const hbs = Handlebars.create();
    for (const name of fs.readdirSync(path.join(root, 'partials')).filter(name => name.endsWith('.hbs'))) hbs.registerPartial(name.slice(0, -4), read('partials/' + name));
    hbs.registerHelper('match', function (a, b, options) { return a === b ? options.fn(this) : options.inverse(this); });
    hbs.registerHelper('foreach', function (items, options) { return items?.length ? items.map(item => options.fn(item)).join('') : options.inverse(this); });
    hbs.registerHelper('get', function (resource, options) {
        const items = resource === 'posts' ? (override.featured === false ? [] : [post]) : [{name: 'Research', url: '/tag/research/', count: {posts: 5}}];
        return options.fn({[resource]: items}, {blockParams: [items]});
    });
    hbs.registerHelper('post', function (options) { return options.fn({...post, ...override}); });
    hbs.registerHelper('img_url', value => value);
    hbs.registerHelper('asset', value => '/assets/' + value);
    hbs.registerHelper('ghost_head', () => new hbs.SafeString(`<style>${css}</style>`));
    hbs.registerHelper('date', function (value, options) { return typeof value === 'string' ? value.slice(0, 10) : this.published_at?.slice(0, 10) || '2025-06-01'; });
    hbs.registerHelper('authors', () => new hbs.SafeString('<a href="/author/analyst/">Fictional analyst</a>'));
    hbs.registerHelper('tags', () => new hbs.SafeString('<a href="/tag/research/">Research</a>'));
    hbs.registerHelper('reading_time', () => '4 min read');
    hbs.registerHelper('content', () => new hbs.SafeString(override.contentHTML ?? '<div class="gh-post-upgrade-cta"><h2>Members only</h2></div>'));
    hbs.registerHelper('navigation', () => new hbs.SafeString(override.navigationHTML ?? '<ul class="nav"><li><a href="/tag/logistics/">Logistics</a></li><li><a href="/library/2025/">2025 archive</a></li></ul>'));
    hbs.registerHelper('pagination', () => new hbs.SafeString('<nav class="pagination"><a href="/library/page/2/">Older publications</a></nav>'));
    return hbs.compile(read(file))({posts: [post], pagination: {page: 1, pages: 2, total: 18}, ...post, ...override}, {data: {site, page: override.page}});
}
let browser;
before(async () => { browser = await chromium.launch({headless: true}); });
after(async () => { await browser?.close(); });
async function fixture(t, html, width = 1280) {
    const page = await browser.newPage({viewport: {width, height: 1000}});
    page.setDefaultTimeout(3000);
    t.after(() => page.close());
    await page.route('**/*', route => route.abort());
    await page.setContent(`<html lang="en"><head><title>Publishing fixture</title><style>${css}</style></head><body><main class="wrap">${html}</main></body></html>`);
    return page;
}

test('homepage distinguishes a real featured selection from the paginated latest collection', async t => {
    const page = await fixture(t, render('index.hbs'));
    assert.equal(await page.locator('.spotlight h2 a').textContent(), post.title);
    assert.equal(await page.locator('#research-library .card').count(), 1);
    assert.equal(await page.locator('#research-library > header h2').textContent(), 'Latest research');
    assert.equal(await page.locator('.spotlight .access-badge').textContent(), 'Members');
    assert(!(await page.content()).includes('PRIVATE_BODY_SENTINEL'));
    await page.setContent(render('index.hbs', {featured: false}));
    assert.equal(await page.locator('.spotlight').count(), 0, 'No invented featured selection');
    assert.equal(await page.locator('a[href="#research-library"]').count() > 0, true);
});
test('library exposes server pagination and real taxonomy/editor navigation without a local filter', async t => {
    const page = await fixture(t, render('library.hbs'));
    assert.equal(await page.getByRole('heading', {level: 1}).textContent(), 'Research library');
    assert.equal(await page.locator('.library-results .card h2').count(), 1);
    assert.equal(await page.locator('.pagination a').getAttribute('href'), '/library/page/2/');
    assert.equal(await page.getByRole('link', {name: '2025 archive'}).getAttribute('href'), '/library/2025/');
    assert.equal(await page.locator('input,select').count(), 0, 'No page-local controls masquerading as a global filter');
    assert(!(await page.content()).includes('PRIVATE_BODY_SENTINEL'));
});
test('publication cards label actual Ghost visibility; reports expose publication and update metadata', async t => {
    for (const [visibility, label] of [['public', 'Public'], ['members', 'Members'], ['paid', 'Paid members'], ['tiers', 'Selected tiers']]) {
        const page = await fixture(t, render('partials/card.hbs', {visibility}));
        assert.equal(await page.locator('.access-badge').textContent(), label);
        assert(!(await page.content()).includes('PRIVATE_BODY_SENTINEL'));
    }
    const page = await fixture(t, render('post.hbs'));
    assert.equal(await page.locator('.report-metadata dt').allTextContents().then(items => items.includes('Published') && items.includes('Updated') && items.includes('Access')), true);
    assert.equal(await page.locator('.report > .report-toc').count(), 1);
    assert.equal(await page.locator('.report > .gh-content').count(), 1);
    assert(!(await page.content()).includes('PRIVATE_BODY_SENTINEL'));
});
test('research surfaces reflow at narrow widths and enlarged text without clipped controls', async t => {
    for (const file of ['index.hbs', 'library.hbs', 'post.hbs']) for (const width of [320, 768, 1280]) {
        const page = await fixture(t, render(file), width);
        for (const size of [16, 32]) {
            await page.addStyleTag({content: `html,body{font-size:${size}px}`});
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file} ${width}px/${size}px overflow`);
            assert(await page.locator('main').evaluate(el => [...el.querySelectorAll('a,button')].filter(a => a.getClientRects().length).every(a => {
                const r = a.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth;
            })), `${file} clips a link`);
        }
    }
});

test('ordinary Pages retain reading styles, title controls and viewport-safe cards', async t => {
    const contentHTML = '<h2 tabindex="-1">Methods</h2><p><a href="#methods">Read the method</a></p><h3>Assumptions</h3><ul><li>Fictional input</li></ul><ol><li>Fictional step</li></ol><figure class="kg-width-wide">Wide sample</figure><figure class="kg-width-full">Full sample</figure>';
    const styles = () => {
        const style = selector => getComputedStyle(document.querySelector(selector));
        return {lineHeight: style('.gh-content').lineHeight, fontSize: style('.gh-content').fontSize,
            h2Size: style('.gh-content h2').fontSize, h2Margin: style('.gh-content h2').marginBlockStart,
            h3Size: style('.gh-content h3').fontSize, h3Margin: style('.gh-content h3').marginBlockStart,
            ulIndent: style('.gh-content ul').paddingInlineStart, olIndent: style('.gh-content ol').paddingInlineStart,
            underlineOffset: style('.gh-content a').textUnderlineOffset, anchorOffset: style('.gh-content h2').scrollMarginTop};
    };
    const reference = await fixture(t, render('post.hbs', {contentHTML, access: true}));
    const expected = await reference.evaluate(styles);
    assert(Math.abs(parseFloat(expected.lineHeight) / parseFloat(expected.fontSize) - 1.85) < 0.01);
    const feature_image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"/%3E';
    for (const width of [320, 390, 768, 1440]) for (const visible of [true, false]) {
        const page = await fixture(t, render('page.hbs', {contentHTML, feature_image, page: {show_title_and_feature_image: visible}}), width);
        assert.deepEqual(await page.evaluate(styles), expected, `Ordinary Page prose changed at ${width}px`);
        assert.equal(await page.locator('article > header h1').count(), Number(visible));
        assert.equal(await page.locator('article > .feature').count(), Number(visible));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert(await page.locator('.kg-width-wide,.kg-width-full,article > .feature').evaluateAll(elements => elements.every(el => {
            const r = el.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1;
        })), `Ordinary Page card leaves viewport at ${width}px`);
    }
});

test('the global shell stays fixed across real long/short document navigation without JavaScript', async t => {
    // A real Chromium navigation fixture for CSS geometry, not Ghost/API acceptance.
    // Keep classic scrollbars visible: overlay-only geometry cannot detect this regression.
    const classic = await chromium.launch({headless: true, ignoreDefaultArgs: ['--hide-scrollbars']});
    t.after(() => classic.close());
    const navigationHTML = '<ul class="nav"><li><a href="/long/">Home</a></li><li><a href="/library/">Library</a></li><li><a href="/short/">About</a></li></ul>';
    const metrics = () => ({scrollbar: innerWidth - document.documentElement.clientWidth,
        boxes: [...document.querySelectorAll('.site-header,.brand,.site-header nav,.member-actions,main,footer')].map(el => ({x: el.getBoundingClientRect().x, width: el.getBoundingClientRect().width}))});
    for (const width of [320, 390, 768, 1440]) {
        const context = await classic.newContext({viewport: {width, height: 1000}, javaScriptEnabled: false});
        t.after(() => context.close());
        const page = await context.newPage();
        await page.route('**/*', route => {
            const pathname = new URL(route.request().url()).pathname;
            if (!['/long/', '/library/', '/short/'].includes(pathname)) return route.abort();
            const contentHTML = pathname === '/short/' ? '<p>A short fictional publication page.</p>' : '<p>A long fictional publication for navigation checks.</p>'.repeat(90);
            const body = render('page.hbs', {contentHTML, page: {show_title_and_feature_image: true}});
            return route.fulfill({contentType: 'text/html', body: render('default.hbs', {body, navigationHTML})});
        });
        await page.goto('http://theme.fixture/long/');
        const initial = await page.evaluate(metrics);
        assert(initial.scrollbar > 0, 'This regression needs nonzero classic scrollbar geometry');
        for (const [name, pathname] of [['About', '/short/'], ['Library', '/library/'], ['About', '/short/'], ['Home', '/long/']]) {
            await page.getByRole('link', {name, exact: true}).click();
            await page.waitForURL('http://theme.fixture' + pathname);
            const actual = await page.evaluate(metrics);
            for (let i = 0; i < initial.boxes.length; i++) {
                assert(Math.abs(actual.boxes[i].x - initial.boxes[i].x) <= 0.5, `Shell ${i} shifted at ${width}px navigating to ${name}`);
                assert(Math.abs(actual.boxes[i].width - initial.boxes[i].width) <= 0.5, `Shell ${i} resized at ${width}px navigating to ${name}`);
            }
        }
    }
});
