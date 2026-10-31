const assert = require('node:assert/strict');
const {test} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Handlebars = require('handlebars');
const {chromium} = require('playwright');
const {contrast} = require('./contrast.cjs');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const defaults = {title: 'Research desk', description: 'Original introduction', allow_self_signup: true, members_signup_access: 'all'};
function render(custom = {}, site = {}, member = null, featured = true) {
    const hbs = Handlebars.create();
    hbs.registerHelper('match', function (a, b, options) { return a === b ? options.fn(this) : options.inverse(this); });
    hbs.registerHelper('get', function (resource, options) { return options.fn({[resource]: featured ? [{title: 'Selection', url: '/selection/'}] : []}); });
    hbs.registerHelper('foreach', function (items, options) { return items?.length ? items.map(item => options.fn(item)).join('') : options.inverse(this); });
    hbs.registerHelper('date', () => '2026-10-31');
    hbs.registerHelper('pagination', () => '');
    for (const file of fs.readdirSync(path.join(root, 'partials')).filter(file => file.endsWith('.hbs'))) hbs.registerPartial(file.slice(0, -4), read('partials/' + file));
    return hbs.compile(read('index.hbs'))({posts: []}, {data: {custom, site: {...defaults, ...site}, member}});
}

test('four bounded homepage settings have safe defaults and a homepage group', () => {
    const custom = JSON.parse(read('package.json')).config.custom;
    assert.deepEqual(Object.keys(custom).sort(), ['hero_description', 'hero_signup_label', 'hero_title', 'show_editor_selection']);
    for (const value of Object.values(custom)) {
        assert.equal(value.group, 'homepage');
        assert(value.description.length < 100);
    }
    assert.equal(custom.show_editor_selection.default, true);
    for (const key of ['hero_title', 'hero_description', 'hero_signup_label']) assert.equal(custom[key].type, 'text');
});
test('custom text is escaped; missing and empty values retain the existing content', () => {
    assert(render().includes('<h1>Research desk</h1>'));
    const empty = render({hero_title: '', hero_description: '', hero_signup_label: ''});
    assert(empty.includes('<p class="lead">Original introduction</p>'));
    assert(empty.includes('Get research updates'));
    const configured = render({hero_title: '<script>bad()</script>', hero_description: '中文简介 & details', hero_signup_label: 'Join our research'});
    assert(configured.includes('&lt;script&gt;bad()&lt;/script&gt;'));
    assert(configured.includes('中文简介 &amp; details'));
    assert(configured.includes('Join our research'));
});
test('custom signup label cannot relabel account, sign-in or paid-only plans', () => {
    const custom = {hero_signup_label: 'Join for free'};
    for (const [site, member, target, label] of [
        [{}, {id: 'fixture'}, 'account', 'Your account'],
        [{allow_self_signup: false, members_signup_access: 'invite'}, null, 'signin', 'Sign in'],
        [{members_signup_access: 'paid', paid_members_enabled: false}, null, 'signin', 'Sign in'],
        [{members_signup_access: 'paid', paid_members_enabled: true}, null, 'signup', 'View plans'],
        [{}, null, 'signup', 'Join for free'],
    ]) assert(render(custom, site, member).includes(`href="#/portal/${target}">${label}</a>`));
});
test('editor selection defaults on, can disappear fully, and has a truthful empty fallback', () => {
    assert(render().includes('class="spotlight"'));
    assert(render({}, {}, null, false).includes('class="reading-guide"'));
    const off = render({show_editor_selection: false});
    assert(!off.includes('class="editorial-selection"'));
    assert(off.includes('publication-hero--intro-only'));
    assert(off.includes('id="research-library"'));
});
test('header provides a named native search entry and brand input without a theme shortcut', () => {
    const template = read('default.hbs');
    assert.match(template, /<a[^>]*href="#\/search"[^>]*data-ghost-search[^>]*>Search<\/a>/);
    assert(template.includes('data-accent-color="{{@site.accent_color}}"'));
    assert(!read('assets/js/accessibility.js').includes('metaKey'));
});
test('brand palette derives a readable accent from dark, light and invalid Ghost settings', () => {
    const script = read('assets/js/brand.js');
    const palette = input => {
        const values = {};
        vm.runInNewContext(script, {document: {documentElement: {dataset: {accentColor: input}, style: {setProperty: (k, v) => { values[k] = v; }}}}});
        return values['--accent'];
    };
    assert.equal(palette(''), '#174e8b');
    assert.equal(palette('url(https://invalid.test)'), '#174e8b');
    assert.equal(palette('#174e8b'), '#174e8b');
    assert.equal(palette('#abc'), palette('#aabbcc'));
    const rgb = hex => hex.match(/[a-f0-9]{2}/gi).map(n => parseInt(n, 16));
    for (const color of ['#fff', '#ffff00', '#00ff00', '#000', '#f20', '#abcdef', '#174e8b', ...Array.from({length: 256}, (_, n) => '#' + n.toString(16).padStart(2, '0').repeat(3))]) {
        const resolved = palette(color);
        for (const bg of [[255,255,255], [245,248,252]]) assert(contrast(rgb(resolved), bg) >= 4.5, `${color} -> ${resolved} fails text/focus contrast`);
    }
});
test('derived palette styles real links, native cards and keyboard focus; disabled selection reflows', async t => {
    const browser = await chromium.launch({headless: true});
    t.after(() => browser.close());
    const page = await browser.newPage({viewport: {width: 320, height: 900}});
    await page.setContent(`<html data-accent-color="#ffff00"><head><style>${read('assets/css/screen.css')}</style></head><body><main class="wrap">${render({show_editor_selection: false, hero_title: '中文'.repeat(50)})}<a class="button" href="#">Action</a><a class="kg-btn" href="#">Native card</a><div class="gh-post-upgrade-cta"><a class="gh-btn" href="#">Upgrade</a></div></main></body></html>`);
    await page.addScriptTag({content: read('assets/js/brand.js')});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(await page.locator('.publication-hero').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
    for (const link of await page.locator('a.button,a.kg-btn,.gh-btn').all()) {
        const colors = await link.evaluate(el => {const s = getComputedStyle(el); return [s.color, s.backgroundColor];});
        const rgb = css => css.match(/\d+/g).slice(0, 3).map(Number);
        assert(contrast(rgb(colors[0]), rgb(colors[1])) >= 4.5);
        await link.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        const focus = await link.evaluate(el => {const s = getComputedStyle(el); return {width: s.outlineWidth, color: s.outlineColor};});
        assert.equal(focus.width, '3px');
        assert(contrast(rgb(focus.color), [255,255,255]) >= 3);
    }
});
test('reachable Portal adapter applies its safe button tone immediately without an unsafe color transition', async t => {
    const browser = await chromium.launch({headless: true});
    t.after(() => browser.close());
    const page = await browser.newPage();
    await page.setContent('<html><head><style>:root{--accent:#767600}</style></head><body><a href="#/portal/signin">Sign in</a><div id="ghost-portal-root"><iframe title="portal-popup"></iframe></div></body></html>');
    const frame = page.frameLocator('iframe');
    await frame.locator('body').evaluate(el => {el.innerHTML = '<style>.gh-portal-btn-main{background:#ff1a75;color:#fff;transition:background-color 10s}</style><button class="gh-portal-btn-main">Continue</button>';});
    await page.addScriptTag({content: read('assets/js/accessibility.js')});
    const sample = await frame.locator('button').evaluate(el => {const s = getComputedStyle(el); return [s.color, s.backgroundColor];});
    const rgb = css => css.match(/\d+/g).slice(0, 3).map(Number);
    assert(contrast(rgb(sample[0]), rgb(sample[1])) >= 4.5, `Unsafe transitional Portal colors: ${sample}`);
});
