// Real Chromium and unmodified pinned Portal; fictional read-only API fixtures.
// No connection to the user's preview, member session, email or payment backend.
const assert = require('node:assert/strict');
const {test, before, after} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const {checkAnonymousFocus} = require('./portal-focus.cjs');
const adapter = fs.readFileSync(path.resolve(__dirname, '../../assets/js/accessibility.js'));
const base = 'http://portal-fixture.test';
let browser;
before(async () => { browser = await chromium.launch({headless: true}); });
after(async () => { await browser?.close(); });
for (const pkg of ['portal-ghost5', '@tryghost/portal']) {
    for (const mode of ['signup', 'signin']) {
        test(`${pkg} ${mode}: placeholder contrast, native Tab order, Escape, close, focus return and reopening`, async t => {
            const bundle = fs.readFileSync(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'umd/portal.min.js'));
            for (const width of [360, 1280]) {
                const context = await browser.newContext({viewport: {width, height: 900}});
                t.after(() => context.close());
                const writes = [];
                await context.route('**/*', route => {
                    const request = route.request(), url = new URL(request.url());
                    if (request.method() !== 'GET') { writes.push(request.method() + ' ' + url.pathname); return route.abort(); }
                    if (url.origin !== base) return route.abort();
                    if (url.pathname === '/') return route.fulfill({contentType: 'text/html', body: `<!doctype html><html lang="en"><head><title>Portal focus fixture</title><style>:root{--accent:#174e8b}body{margin:0}</style></head><body><main><a id="trigger" href="#/portal/${mode}">Open ${mode}</a></main><script src="/adapter.js"></script><script defer src="/portal.min.js" data-ghost="${base}/" data-api="${base}/ghost/api/content/" data-key="fixture-placeholder" crossorigin="anonymous"></script></body></html>`});
                    if (url.pathname === '/adapter.js') return route.fulfill({contentType: 'application/javascript', body: adapter});
                    if (url.pathname === '/portal.min.js') return route.fulfill({contentType: 'application/javascript', body: bundle});
                    if (url.pathname === '/members/api/member/') return route.fulfill({status: 204});
                    const settings = {title: 'Portal focus fixture', description: 'Fictional read-only browser fixture', url: base + '/', locale: 'en', accent_color: '#174e8b', members_signup_access: 'all', members_enabled: true, allow_self_signup: true, portal_name: true, portal_button: false, portal_plans: ['free'], paid_members_enabled: false};
                    const data = {
                        '/ghost/api/content/settings/': {settings},
                        '/ghost/api/content/tiers/': {tiers: [{id: 'fixture-free', name: 'Free', type: 'free', active: true, visibility: 'public', benefits: []}]},
                        '/ghost/api/content/newsletters/': {newsletters: []},
                        '/members/api/site/': {site: settings},
                    }[url.pathname];
                    return data ? route.fulfill({json: data}) : route.fulfill({status: 404});
                });
                const page = await context.newPage();
                page.setDefaultTimeout(5000);
                await page.goto(base);
                const trigger = () => page.locator('#trigger');
                const open = async () => {
                    await trigger().focus(); await trigger().press('Enter');
                    assert.equal(await page.locator('iframe[title="portal-popup"]').count() <= 1, true);
                };
                const contrast = await checkAnonymousFocus({page, trigger, open, firstLabel: mode === 'signup' ? 'Name' : 'Email'});
                t.diagnostic(JSON.stringify({width, contrast}));
                assert.deepEqual(writes, [], 'Anonymous keyboard flow must not send writes');
                await context.close();
            }
        });
    }
}
