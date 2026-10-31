// Genuine Ghost API + unmodified official Sodo Search/Portal, disposable data only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');
const {rgb, contrast} = require('./contrast.cjs');

async function checkPublisherExperience({browser, base, admin, api, out, record, portalPackage}) {
    const report = {searchVersion: require('@tryghost/sodo-search/package.json').version,
        boundary: 'Unmodified pinned official native search; real loopback Ghost APIs. No API/UI success mocks or private body index. Browser resources outside loopback blocked.',
        checks: [], searchResponses: [], externalRequestsBlocked: []};
    const before = (await api(admin, 'get', 'custom_theme_settings/')).custom_theme_settings;
    const brandBefore = (await api(admin, 'get', 'settings/')).settings.find(s => s.key === 'accent_color').value;
    const set = values => api(admin, 'put', 'custom_theme_settings/', {custom_theme_settings: Object.entries(values).map(([key, value]) => ({key, value}))});
    const searchDir = path.dirname(require.resolve('@tryghost/sodo-search/package.json'));
    const portalDir = path.dirname(require.resolve(`${portalPackage}/package.json`));
    const context = await browser.newContext({viewport: {width: 1280, height: 900}});
    const serve = route => {
        const url = new URL(route.request().url());
        if (url.origin === 'https://fonts.bunny.net' && url.pathname === '/css' && route.request().resourceType() === 'stylesheet') {
            return route.fulfill({contentType: 'text/css', body: '', headers: {'Access-Control-Allow-Origin': base}});
        }
        if (url.origin !== base) {report.externalRequestsBlocked.push({origin: url.origin, path: url.pathname}); return route.abort();}
        const assets = {
            '/__qa__/sodo-search.min.js': [path.join(searchDir, 'umd/sodo-search.min.js'), 'application/javascript'],
            '/__qa__/sodo-search.css': [path.join(searchDir, 'umd/main.css'), 'text/css'],
            '/__qa__/portal.min.js': [path.join(portalDir, 'umd/portal.min.js'), 'application/javascript'],
        };
        const asset = assets[url.pathname];
        return asset ? route.fulfill({contentType: asset[1], body: fs.readFileSync(asset[0])}) : route.continue();
    };
    await context.route('**/*', serve);
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const pending = [];
    page.on('response', response => {
        const url = new URL(response.url());
        if (!url.pathname.startsWith('/ghost/api/content/search-index/')) return;
        pending.push((async () => {
            const json = await response.json();
            const serialized = JSON.stringify(json);
            report.searchResponses.push({path: url.pathname, status: response.status(),
                privateBodyAbsent: !/MEMBERS_SECRET_71b|PAID_SECRET_28f|TIER_A_SECRET_59c|RESEARCH_LIBRARY_PRIVATE_6a1|SEARCH_PRIVATE_BODY|SEARCH_DRAFT_TITLE|SEARCH_PRIVATE_EXCERPT/.test(serialized),
                privateFieldsAbsent: !/"(?:html|lexical|plaintext|email|password|stripe_customer_id)"/.test(serialized)});
        })());
    });
    const run = async (name, action) => {
        const check = {name, status: 'failed'}; report.checks.push(check);
        await probe(record, name, async () => {try {await action(check); check.status = 'passed';} catch (e) {check.error = e.message; throw e;}});
    };
    try {
        await run('Publisher settings persist through real Ghost API and refresh with escaped text and one-column selection off', async check => {
            const values = {hero_title: '研究观察 <b>text</b>', hero_description: '中文研究简介 & public details', hero_signup_label: 'Follow the research', show_editor_selection: false};
            await set(values);
            const stored = (await api(admin, 'get', 'custom_theme_settings/')).custom_theme_settings;
            for (const [key, value] of Object.entries(values)) assert.equal(stored.find(s => s.key === key).value, value);
            await page.goto(base);
            await page.reload();
            assert.equal(await page.locator('.publication-intro h1').textContent(), values.hero_title);
            assert.equal(await page.locator('.publication-intro h1 b').count(), 0);
            assert.equal(await page.locator('.publication-intro .lead').textContent(), values.hero_description);
            assert.equal(await page.locator('.editorial-selection').count(), 0);
            assert.equal(await page.locator('.publication-hero').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
            assert(await page.locator('#research-library .card').count() > 0);
            await page.screenshot({path: path.join(out, 'publisher-configured-desktop.png'), fullPage: true});
            await page.setViewportSize({width: 390, height: 844});
            check.mobile = await page.locator('#research-library .card').first().evaluate(el => ({width: innerWidth, height: innerHeight, textSize: getComputedStyle(document.body).fontSize, firstCardTop: el.getBoundingClientRect().top}));
            await page.screenshot({path: path.join(out, 'publisher-configured-390.png')});
            await page.setViewportSize({width: 320, height: 900});
            await page.evaluate(() => {document.documentElement.style.fontSize = '32px'; document.body.style.fontSize = '32px';});
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await page.screenshot({path: path.join(out, 'publisher-configured-320.png'), fullPage: true});
            await page.setViewportSize({width: 1280, height: 900});
            await set({hero_title: '', hero_description: '', hero_signup_label: '', show_editor_selection: true});
            await page.reload();
            const settings = (await api(admin, 'get', 'settings/')).settings;
            assert.equal(await page.locator('.publication-intro h1').textContent(), settings.find(s => s.key === 'title').value);
            assert.equal(await page.locator('.editorial-selection').count(), 1);
        });
        await run('Native Ghost Admin saves homepage settings and brand color through reload', async check => {
            const owner = await browser.newContext({storageState: await admin.storageState(), viewport: {width: 1440, height: 1000}});
            await owner.route('**/*', serve);
            const ui = await owner.newPage();
            ui.setDefaultTimeout(15000);
            try {
                await ui.goto(`${base}/ghost/#/settings/design/edit`, {waitUntil: 'domcontentloaded'});
                await ui.getByRole('tab', {name: 'Theme', exact: true}).click();
                await ui.locator('#theme-setting-hero_title').fill('Admin saved research desk');
                await ui.locator('#theme-setting-hero_description').fill('Saved from native Ghost Admin.');
                await ui.locator('#theme-setting-hero_signup_label').fill('Read with us');
                await ui.locator('#theme-setting-show_editor_selection').click();
                check.stage = 'save homepage controls';
                const [saved] = await Promise.all([
                    ui.waitForResponse(r => new URL(r.url()).pathname === '/ghost/api/admin/custom_theme_settings/' && r.request().method() === 'PUT'),
                    ui.getByRole('button', {name: 'Save', exact: true}).click(),
                ]);
                assert(saved.ok(), 'Native custom setting save failed');
                await ui.reload();
                await ui.getByRole('tab', {name: 'Theme', exact: true}).click();
                assert.equal(await ui.locator('#theme-setting-hero_title').inputValue(), 'Admin saved research desk');
                assert.equal(await ui.locator('#theme-setting-show_editor_selection').getAttribute('aria-checked'), 'false');
                await page.goto(base);
                assert.equal(await page.locator('.publication-intro h1').textContent(), 'Admin saved research desk');
                assert.equal(await page.locator('.hero-actions .button').textContent(), 'Read with us');
                await ui.getByRole('tab', {name: 'Brand', exact: true}).click();
                await ui.getByTestId('accent-color-picker').getByRole('button').click();
                const picker = ui.getByRole('textbox', {name: 'Hex color', exact: true});
                await picker.fill('#ffff00'); await picker.press('Tab');
                check.stage = 'wait for native debounced brand preview';
                await ui.waitForFunction(() => [...document.querySelectorAll('iframe')].some(frame => {
                    try {return frame.contentDocument?.documentElement?.dataset.accentColor === '#ffff00';} catch {return false;}
                }));
                await ui.keyboard.press('Escape');
                check.stage = 'save brand color';
                const [brandSaved] = await Promise.all([
                    ui.waitForResponse(r => new URL(r.url()).pathname === '/ghost/api/admin/settings/' && r.request().method() === 'PUT'),
                    ui.getByRole('button', {name: 'Save', exact: true}).click(),
                ]);
                assert(brandSaved.ok(), 'Native brand save failed');
                await ui.reload();
                assert.equal((await api(admin, 'get', 'settings/')).settings.find(s => s.key === 'accent_color').value, '#ffff00');
                await page.goto(base);
                assert.equal(await page.locator('html').getAttribute('data-accent-color'), '#ffff00');
                await page.screenshot({path: path.join(out, 'publisher-admin-saved.png'), fullPage: true});
            } finally {await owner.close();}
        });
        await run('Ghost brand accent stays readable on theme/native-card buttons and reachable stock Portal', async check => {
            check.palettes = [];
            for (const color of ['#174e8b', '#ffff00', '#ffffff']) {
                await api(admin, 'put', 'settings/', {settings: [{key: 'accent_color', value: color}]});
                await page.goto(base);
                const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
                check.palettes.push({configured: color, resolved: accent});
                const channels = accent.slice(1).match(/../g).map(n => parseInt(n, 16));
                for (const surface of [[255,255,255], [245,248,252]]) assert(contrast(channels, surface) >= 4.5);
                const action = page.locator('.hero-actions .button');
                const styles = await action.evaluate(el => {const s = getComputedStyle(el); return {fg: s.color, bg: s.backgroundColor};});
                assert(contrast(rgb(styles.fg), rgb(styles.bg)) >= 4.5);
                await action.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
                assert.equal(await action.evaluate(el => getComputedStyle(el).outlineWidth), '3px');
                for (const [route, selector] of [['/editor-cards/', '.kg-btn'], ['/members-report/', '.gh-post-upgrade-cta .gh-btn']]) {
                    await page.goto(base + route);
                    const native = await page.locator(selector).first().evaluate(el => {const s = getComputedStyle(el); return {fg: s.color, bg: s.backgroundColor};});
                    assert(contrast(rgb(native.fg), rgb(native.bg)) >= 4.5, `Native action contrast: ${selector}`);
                }
                await page.goto(base);
                await page.locator('.member-actions a[href="#/portal/signin"]').click();
                const portal = page.frameLocator('iframe[title="portal-popup"]');
                await portal.locator('.gh-portal-btn-main').first().waitFor();
                const palette = await portal.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--brandcolor').trim());
                assert.equal(palette, accent);
                const portalStyles = await portal.locator('.gh-portal-btn-main').first().evaluate(el => {const s = getComputedStyle(el); return {fg: s.color, bg: s.backgroundColor};});
                check.palettes.at(-1).portal = portalStyles;
                assert(contrast(rgb(portalStyles.fg), rgb(portalStyles.bg)) >= 4.5, `Portal ${color}: ${JSON.stringify(portalStyles)}`);
                await portal.locator('input').first().focus(); await page.keyboard.press('Escape');
                await page.locator('iframe[title="portal-popup"]').waitFor({state: 'detached'});
            }
        });
        await run('Native search keyboard open/escape/focus return repeats and finds Chinese metadata beyond homepage 12', async () => {
            await api(admin, 'post', 'posts/?source=html', {posts: [{title: '中文检索 深度旧报告', slug: 'qa-native-search-old', status: 'published', published_at: '2020-01-01T00:00:00.000Z', html: '<p>Public fictional text.</p>'}]});
            await api(admin, 'post', 'posts/?source=html', {posts: [{title: 'Protected search metadata', slug: 'qa-native-search-private', status: 'published', visibility: 'members', custom_excerpt: 'SEARCH_PRIVATE_EXCERPT', html: '<p>SEARCH_PRIVATE_BODY</p>'}]});
            await api(admin, 'post', 'posts/?source=html', {posts: [{title: 'SEARCH_DRAFT_TITLE', slug: 'qa-native-search-draft', status: 'draft', html: '<p>Private draft.</p>'}]});
            await page.goto(base);
            assert.equal(await page.locator('#research-library .card').count(), 12);
            assert.equal(await page.locator('#research-library a[href="/qa-native-search-old/"]').count(), 0);
            const trigger = page.locator('.member-actions [data-ghost-search]');
            const frame = page.frameLocator('#sodo-search-root iframe');
            const input = frame.getByRole('combobox');
            for (let repeat = 0; repeat < 3; repeat++) {
                await trigger.focus(); await page.keyboard.press('Enter');
                await input.waitFor(); await input.fill('中文检索');
                await frame.getByRole('option').filter({hasText: '中文检索 深度旧报告'}).waitFor();
                await page.keyboard.press('Escape');
                await page.locator('#sodo-search-root iframe').waitFor({state: 'detached'});
                assert(await trigger.evaluate(el => el === document.activeElement), 'Native search did not return focus to its trigger');
            }
            await trigger.press('Enter'); await input.waitFor();
            await input.fill('无结果查询'.repeat(50));
            await frame.getByText('No matches found', {exact: true}).waitFor();
            assert.equal(await frame.getByRole('option').count(), 0);
            await input.fill('Protected search metadata');
            await frame.getByRole('option').filter({hasText: 'Protected search metadata'}).waitFor();
            assert(!(await frame.locator('body').textContent()).includes('SEARCH_PRIVATE_EXCERPT'));
            await page.screenshot({path: path.join(out, 'native-search.png'), fullPage: true});
            await page.keyboard.press('Escape');
            await page.locator('#sodo-search-root iframe').waitFor({state: 'detached'});
            await Promise.all(pending);
            assert(report.searchResponses.length >= 1, 'Native search did not reach actual Ghost search-index API');
            for (const response of report.searchResponses) assert(response.status === 200 && response.privateBodyAbsent && response.privateFieldsAbsent, `Unsafe/failed search response: ${response.path}`);
        });
    } finally {
        await context.close();
        await api(admin, 'put', 'custom_theme_settings/', {custom_theme_settings: before.map(({key, value}) => ({key, value}))});
        await api(admin, 'put', 'settings/', {settings: [{key: 'accent_color', value: brandBefore}]});
        fs.writeFileSync(path.join(out, 'publisher-settings-search.json'), JSON.stringify(report, null, 2));
    }
}
module.exports = {checkPublisherExperience};
