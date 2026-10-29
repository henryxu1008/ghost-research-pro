const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {probe} = require('./accessibility.cjs');

const hash = buffer => createHash('sha256').update(buffer).digest('hex');

function invalidArchive() {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ghost-admin-negative-'));
    try {
        fs.writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({
            name: 'qa-invalid-theme', version: '0.0.0', description: 'Controlled missing-template fixture',
            engines: {ghost: '>=5.0.0'}, author: {name: 'QA', email: 'qa@example.test'},
        }));
        execFileSync('zip', ['-q', 'invalid.zip', 'package.json'], {cwd: temporary});
        return fs.readFileSync(path.join(temporary, 'invalid.zip'));
    } finally {
        assert(path.resolve(temporary).startsWith(path.resolve(os.tmpdir()) + path.sep + 'ghost-admin-negative-'));
        fs.rmSync(temporary, {recursive: true, force: true});
    }
}

async function checkAdminUI({browser, admin, base, out, root, archive, record, portalPackage, fixturePagePath}) {
    const name = 'ghost-research-pro';
    const expectedVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version;
    const report = {authentication: 'disposable owner session seeded by existing Admin API fixture; login UI not tested',
        zipSHA256: hash(archive), packageVersion: expectedVersion, checks: [], externalRequestsBlocked: [], paymentEndpointsBlocked: [],
        resourceFailures: [], moduleResponses: [], browserErrors: [],
        fontStylesheetFallback: {origin: 'https://fonts.bunny.net', path: '/css', response: 'local empty CSS; system fonts; no outbound request', requests: 0}};
    assert(/^\/about(?:-\d+)?\/$/.test(fixturePagePath), 'Missing canonical disposable page fixture');
    // Cookies remain in memory; no storage state, credentials or raw API data
    // are uploaded. All theme mutations below originate from native UI actions.
    const ctx = await browser.newContext({storageState: await admin.storageState(), viewport: {width: 1440, height: 1000}});
    const bundle = path.join(path.dirname(require.resolve(`${portalPackage}/package.json`)), 'umd/portal.min.js');
    await ctx.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === base && url.pathname === '/__qa__/portal.min.js') {
            return route.fulfill({contentType: 'application/javascript', body: fs.readFileSync(bundle)});
        }
        // Stock Ghost 6 preloads custom-fonts CSS with remote @imports. Aborting
        // those stylesheets rejects the whole Admin route. Resolve this exact
        // nonfunctional font dependency locally; preserve every native bundle
        // and API request, and make no connection to the font provider.
        if (url.origin === 'https://fonts.bunny.net' && url.pathname === '/css' && route.request().resourceType() === 'stylesheet') {
            report.fontStylesheetFallback.requests++;
            return route.fulfill({status: 200, contentType: 'text/css', headers: {'Access-Control-Allow-Origin': base},
                body: '/* Offline acceptance fixture: use system font fallbacks. */'});
        }
        // The stock Admin imports local chunks such as stripe-button-*.js even
        // on non-billing screens. Static files are not payment API calls.
        if (url.origin === base && (url.pathname.startsWith('/ghost/assets/') || !/checkout|billing|stripe/i.test(url.pathname))) return route.continue();
        const label = url.origin + url.pathname;
        const blocked = url.origin === base ? report.paymentEndpointsBlocked : report.externalRequestsBlocked;
        if (!blocked.includes(label)) blocked.push(label);
        return route.abort();
    });
    const page = await ctx.newPage();
    const front = await ctx.newPage();
    const safeError = text => text.split('\n')[0].replace(/https?:\/\/[^\s"'<>]+/g, value => {
        try { const url = new URL(value); return url.origin + url.pathname; } catch { return '[url]'; }
    }).replace(/[A-Za-z0-9_-]{32,}/g, '[redacted]').slice(0, 800);
    const recordError = (kind, message) => {
        const item = {kind, message: safeError(message)};
        if (report.browserErrors.length < 40 && !report.browserErrors.some(previous => JSON.stringify(previous) === JSON.stringify(item))) report.browserErrors.push(item);
    };
    // Observe Vite's actual rejected import before React's error boundary or
    // automatic reload handles it. Do not prevent the event or alter loading.
    await ctx.exposeBinding('__qaAdminDiagnostic', (source, item) => recordError(item.kind, item.message));
    await ctx.addInitScript(() => {
        window.addEventListener('vite:preloadError', event => {
            window.__qaAdminDiagnostic({kind: 'vite-preload', message: String(event.payload?.message || event.payload)}).catch(() => {});
        });
        window.addEventListener('securitypolicyviolation', event => {
            window.__qaAdminDiagnostic({kind: 'csp', message: `${event.violatedDirective}: ${event.blockedURI}`}).catch(() => {});
        });
    });
    const resourceFailure = (request, status, error) => {
        const url = new URL(request.url());
        const item = {origin: url.origin, path: url.pathname, type: request.resourceType(), ...(status ? {status} : {}), ...(error ? {error} : {})};
        if (report.resourceFailures.length < 80 && !report.resourceFailures.some(previous => JSON.stringify(previous) === JSON.stringify(item))) report.resourceFailures.push(item);
    };
    ctx.on('requestfailed', request => resourceFailure(request, undefined, request.failure()?.errorText));
    ctx.on('response', response => {
        if (response.status() >= 400) resourceFailure(response.request(), response.status());
        const url = new URL(response.url());
        if (url.origin === base && url.pathname.startsWith('/ghost/assets/') && /\.(?:js|css)$/.test(url.pathname)) {
            const item = {path: url.pathname, status: response.status(), mime: response.headers()['content-type']};
            if (report.moduleResponses.length < 600 && !report.moduleResponses.some(previous => JSON.stringify(previous) === JSON.stringify(item))) report.moduleResponses.push(item);
        }
    });
    page.on('pageerror', error => recordError('uncaught', error.message));
    page.on('console', message => {
        if (message.type() === 'error') recordError('console', message.text());
    });
    page.setDefaultTimeout(15000);
    front.setDefaultTimeout(15000);
    const dialog = title => page.getByTestId('confirmation-modal')
        .filter({has: page.getByRole('heading', {name: title, exact: true})});
    const responseAfter = async (document, predicate, action) => {
        let listener, timer;
        const pending = new Promise((resolve, reject) => {
            listener = response => { if (predicate(response)) resolve(response); };
            document.on('response', listener);
            timer = setTimeout(() => reject(new Error('Admin UI response did not arrive within 15000ms')), 15000);
        });
        try {
            // Both branches are handled before the action runs. If an action
            // fails, remove its waiter instead of leaking a later rejection.
            const [response] = await Promise.all([pending, Promise.resolve().then(action)]);
            return response;
        } finally { clearTimeout(timer); document.off('response', listener); }
    };
    let current, expectedUpload;
    const themeWrite = request => new URL(request.url()).pathname.startsWith('/ghost/api/admin/themes/') && ['POST', 'PUT', 'DELETE'].includes(request.method());
    const uploaded = response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/ghost/api/admin/themes/upload/';
    const activated = response => response.request().method() === 'PUT' && new URL(response.url()).pathname === `/ghost/api/admin/themes/${name}/activate/`;
    page.on('request', request => {
        if (!current || !themeWrite(request)) return;
        current.requests.push({method: request.method(), path: new URL(request.url()).pathname,
            ...(request.method() === 'POST' ? {containsSelectedArchive: Boolean(expectedUpload && request.postDataBuffer()?.includes(expectedUpload))} : {})});
    });
    page.on('response', response => {
        if (current && themeWrite(response.request())) current.responses.push({method: response.request().method(), path: new URL(response.url()).pathname, status: response.status()});
    });
    const readThemes = async () => {
        const response = await admin.get(`${base}/ghost/api/admin/themes/`);
        assert(response.status() === 200, 'Cannot observe disposable theme state');
        return (await response.json()).themes;
    };
    const assertActive = async () => {
        const themes = await readThemes(), own = themes.filter(theme => theme.name === name);
        assert(own.length === 1 && own[0].active && own[0].package?.version === expectedVersion, 'Active theme name/version/uniqueness is incorrect');
        return {name, version: own[0].package.version, active: true, count: own.length};
    };
    const openThemes = async () => {
        // Directly open the official theme-management UI, not an API route.
        await page.goto(`${base}/ghost/#/settings/design/change-theme`, {waitUntil: 'domcontentloaded'});
        await page.getByRole('button', {name: 'Upload theme', exact: true}).waitFor();
    };
    const installed = async () => {
        await page.getByRole('tab', {name: 'Installed', exact: true})
            .or(page.getByRole('button', {name: 'Installed', exact: true})).click();
        const row = page.locator('[data-testid="theme-list-item"]').filter({hasText: name});
        await row.waitFor();
        assert((await row.innerText()).includes(expectedVersion), 'Admin list does not show the packaged version');
        assert((await row.innerText()).includes('Active'), 'Admin list does not identify the active theme');
    };
    const select = async (fileName, buffer) => {
        expectedUpload = buffer;
        await page.getByRole('button', {name: 'Upload theme', exact: true}).click();
        await page.locator('input#theme-upload').setInputFiles({name: fileName, mimeType: 'application/zip', buffer});
    };
    const frontend = async entry => {
        const css = await responseAfter(front, response => new URL(response.url()).pathname === '/assets/css/screen.css',
            () => front.goto(base, {waitUntil: 'networkidle'}));
        assert(css.status() === 200, 'Activated theme stylesheet was not delivered');
        entry.frontendCSSMatchesArchive = hash(await css.body()) === hash(fs.readFileSync(path.join(root, 'assets/css/screen.css')));
        assert(entry.frontendCSSMatchesArchive, 'Frontend CSS differs from the uploaded release payload');
        assert(await front.locator('.site-header.wrap').count() === 1, 'Frontend is not rendered by the installed theme');
        entry.frontendChecks = [];
        for (const [route, marker] of [['/public-report/', 'PUBLIC_BODY'], [fixturePagePath, 'QA public page body.']]) {
            const response = await front.goto(base + route, {waitUntil: 'networkidle'});
            const observed = {route, status: response.status(), markerVisible: (await front.locator('main').innerText()).includes(marker), markerInHTML: (await front.content()).includes(marker)};
            entry.frontendChecks.push(observed);
            await front.screenshot({path: path.join(out, `admin-ui-frontend-${report.checks.length}-${route.replace(/\//g, '')}.png`), fullPage: true, animations: 'disabled'});
            assert(observed.status === 200 && observed.markerVisible && observed.markerInHTML, `Activated frontend fixture content missing on ${route}`);
        }
        entry.frontendPages = ['/', '/public-report/', fixturePagePath];
    };
    const run = async (label, action) => {
        const entry = {name: label, status: 'failed', requests: [], responses: []};
        report.checks.push(entry); current = entry;
        await probe(record, label, async () => {
            try { await action(entry); entry.status = 'passed'; }
            catch (error) {
                entry.error = error.message;
                entry.visibleHeadings = await page.getByRole('heading').allTextContents();
                entry.visibleButtons = await page.getByRole('button').allTextContents();
                entry.frames = page.frames().map(frame => { try { return new URL(frame.url()).pathname; } catch { return 'local'; } });
                throw error;
            } finally {
                await page.screenshot({path: path.join(out, `admin-ui-${report.checks.length}.png`), fullPage: true, animations: 'disabled'});
            }
        });
        current = null;
    };
    try {
        await run('Admin UI uploads the release ZIP, activates it and renders the packaged frontend', async entry => {
            const before = await readThemes();
            assert(!before.some(theme => theme.name === name), 'UI installation must start before API theme installation');
            entry.initialThemeAbsent = true;
            await openThemes();
            const response = await responseAfter(page, uploaded, () => select(`${name}.zip`, archive));
            assert(response.status() === 200, 'Native Admin upload failed');
            const success = dialog('Upload successful');
            await success.waitFor();
            const activation = await responseAfter(page, activated,
                () => success.getByRole('button', {name: /^Activate(?: theme)?$/}).click());
            assert(activation.status() === 200, 'Native Admin activation failed');
            entry.backend = await assertActive();
            await openThemes();
            await installed();
            await page.screenshot({path: path.join(out, 'admin-ui-installed-version.png'), fullPage: true, animations: 'disabled'});
            await frontend(entry);
            assert(entry.requests.length === 2 && entry.requests[0].containsSelectedArchive && entry.responses.every(response => response.status === 200), 'Unexpected upload/activation request sequence');
        });
        await run('Admin UI upload/overwrite cancellation sends no theme mutation', async entry => {
            await openThemes();
            await page.getByRole('button', {name: 'Upload theme', exact: true}).click();
            await page.locator('input#theme-upload').waitFor({state: 'attached'});
            await dialog('Upload theme').getByRole('button', {name: 'Cancel', exact: true}).click();
            await select(`${name}.zip`, archive);
            await dialog('Overwrite theme').waitFor();
            await page.screenshot({path: path.join(out, 'admin-ui-overwrite-confirmation.png'), fullPage: true, animations: 'disabled'});
            await dialog('Overwrite theme').getByRole('button', {name: 'Cancel', exact: true}).click();
            await page.reload({waitUntil: 'domcontentloaded'});
            await page.getByRole('button', {name: 'Upload theme', exact: true}).waitFor();
            entry.backend = await assertActive();
            assert(entry.requests.length === 0 && entry.responses.length === 0, 'Cancel uploaded or activated a theme');
        });
        await run('Admin UI confirmed repeat upload keeps one active packaged theme', async entry => {
            await openThemes();
            await select(`${name}.zip`, archive);
            await dialog('Overwrite theme').waitFor();
            const response = await responseAfter(page, uploaded,
                () => dialog('Overwrite theme').getByRole('button', {name: 'Overwrite', exact: true}).click());
            assert(response.status() === 200, 'Confirmed repeat upload did not reach Ghost');
            const success = dialog(/^(Upload successful|It's live!)$/);
            await success.waitFor();
            // The theme was already active; no activation request is necessary.
            await success.getByRole('button', {name: 'OK', exact: true}).click();
            entry.backend = await assertActive();
            await openThemes();
            await installed();
            assert(entry.requests.length === 1 && entry.requests[0].method === 'POST' && entry.requests[0].containsSelectedArchive && entry.responses[0].status === 200, 'Repeat upload duplicated a theme mutation');
        });
        await run('Admin UI rejects a missing-template ZIP without replacing the active release', async entry => {
            await openThemes();
            const response = await responseAfter(page, uploaded, () => select('qa-invalid-theme.zip', invalidArchive()));
            assert(response.status() === 422, 'Invalid theme was not rejected by Ghost validation');
            const errorDialog = dialog(/^(Invalid Theme|Theme not uploaded)$/);
            await errorDialog.waitFor();
            const text = await errorDialog.innerText();
            entry.actionableTemplateError = /index\.hbs/.test(text);
            assert(entry.actionableTemplateError, 'Invalid ZIP feedback does not identify the missing required template');
            await page.screenshot({path: path.join(out, 'admin-ui-invalid-zip.png'), fullPage: true, animations: 'disabled'});
            await errorDialog.getByRole('button', {name: /^(Close|Cancel)$/}).click();
            await errorDialog.waitFor({state: 'hidden'});
            entry.backend = await assertActive();
            assert(!(await readThemes()).some(theme => theme.name === 'qa-invalid-theme'), 'Invalid theme was installed');
            await frontend(entry);
            assert(entry.requests.length === 1 && entry.requests[0].method === 'POST' && entry.requests[0].containsSelectedArchive && entry.responses[0].status === 422, 'Invalid ZIP changed active theme state');
        });
    } finally {
        fs.writeFileSync(path.join(out, 'admin-ui.json'), JSON.stringify(report, null, 2));
        await ctx.close();
    }
}

module.exports = {checkAdminUI};
