// Focused browser fixture tests; these do not replace Ghost member-access acceptance.
const assert = require('node:assert/strict');
const {test, before, after} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '../..');
const script = fs.readFileSync(path.join(root, 'assets/js/accessibility.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/screen.css'), 'utf8');
const template = fs.readFileSync(path.join(root, 'post.hbs'), 'utf8');
const nav = template.match(/<nav class="report-toc"[\s\S]*?<\/nav>/)?.[0];
let browser;
before(async () => {
    assert(nav, 'Post template must include the progressively enhanced TOC');
    browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_EXECUTABLE_PATH ? {executablePath: process.env.CHROMIUM_EXECUTABLE_PATH} : {})});
});
after(async () => { await browser?.close(); });
async function fixture(t, content, extra = '', width = 1000) {
    const page = await browser.newPage({viewport: {width, height: 800}});
    t.after(() => page.close());
    const requests = [];
    await page.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
    t.after(() => assert.deepEqual(requests, [], 'TOC must not request content or navigate away'));
    await page.setContent(`<html lang="en"><head><title>Report fixture</title><style>${css}</style></head><body><main class="wrap">${extra}<article class="report">${nav}<div class="gh-content">${content}</div><aside><h2>Stay informed</h2></aside></article></main></body></html>`);
    await page.addScriptTag({content: script});
    return page;
}
test('Chinese, duplicate, punctuation and existing IDs form safe unique nested links', async t => {
    const page = await fixture(t, '<h3>Opening</h3><h2>研究发现</h2><h3>数据</h3><h2>研究发现</h2><h2>!!!</h2><h2 id="saved:章节">Saved <em>heading</em></h2>', '<span id="report-研究发现"></span>');
    const ids = await page.locator('.gh-content h2,.gh-content h3').evaluateAll(nodes => nodes.map(n => n.id));
    assert.deepEqual(ids, ['report-opening', 'report-研究发现-2', 'report-数据', 'report-研究发现-3', 'report-section', 'saved:章节']);
    assert.equal(await page.locator('.report-toc > ol > li').count(), 5);
    assert.equal(await page.locator('.report-toc > ol > li > ol > li').count(), 1);
    assert.deepEqual(await page.locator('.report-toc a').evaluateAll(nodes => nodes.map(n => decodeURIComponent(n.hash.slice(1)))), ids);
    assert.equal(await page.locator('.report-toc a').last().textContent(), 'Saved heading');
    assert.equal(await page.locator('.report-toc em').count(), 0);
});
test('only visible article H2/H3 are listed; hidden and upgrade content stays out', async t => {
    const page = await fixture(t, '<h2>Preview <span hidden>Secret inline</span></h2><div hidden><h2>Hidden secret</h2></div><h2 style="display:none">Display secret</h2><h3 style="visibility:hidden">Visibility secret</h3><div aria-hidden="true"><h2>ARIA secret</h2></div><div inert><h2>Inert secret</h2></div><details><summary>Details</summary><h2>Closed secret</h2></details><div class="gh-post-upgrade-cta"><h2>Upgrade</h2></div><h2> </h2><h4>Not a section</h4>');
    assert.deepEqual(await page.locator('.report-toc a').allTextContents(), ['Preview']);
});
test('empty and upgrade-only posts keep the navigation hidden', async t => {
    for (const content of ['<p>No sections.</p>', '<div class="gh-post-upgrade-cta"><h2>Subscribe</h2></div>']) {
        const page = await fixture(t, content);
        assert.equal(await page.locator('.report-toc').isVisible(), false);
        assert.equal(await page.locator('.report-toc a').count(), 0);
    }
});
test('native keyboard links focus headings and preserve authored tabindex', async t => {
    const page = await fixture(t, '<h2 id="existing" tabindex="0">First</h2><p style="height:1000px">Body</p><h3>末尾</h3>');
    const link = page.locator('.report-toc a').last();
    await page.locator('.report-toc a').first().focus();
    await page.keyboard.press('Tab');
    assert.equal(await link.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#report-末尾').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('#existing').getAttribute('tabindex'), '0');
    await link.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#report-末尾').evaluate(el => el === document.activeElement), true);
});
test('long labels do not overflow at mobile, desktop or enlarged text sizes', async t => {
    for (const width of [320, 1280]) {
        const page = await fixture(t, `<h2>${'LongUnbrokenHeading'.repeat(25)}</h2><h3>${'中文研究'.repeat(60)}</h3>`, '', width);
        await page.addStyleTag({content: 'body{font-size:32px}'});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
        assert.equal(await page.locator('.report-toc').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    }
});
test('duplicate authored IDs are preserved without creating misleading links', async t => {
    const page = await fixture(t, '<h2 id="same">First</h2><h2 id="same">Second</h2>');
    assert.deepEqual(await page.locator('.gh-content h2').evaluateAll(nodes => nodes.map(n => n.id)), ['same', 'same']);
    assert.deepEqual(await page.locator('.report-toc a').allTextContents(), ['First']);
});
