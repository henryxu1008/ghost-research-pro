// Runs ONLY against a disposable Ghost installation. No Stripe credentials or mail relay.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const {spawn} = require('node:child_process');
const {randomBytes} = require('node:crypto');
const {createRequire} = require('node:module');
const {request, chromium} = require('playwright');
const {simpleParser} = require('mailparser');
const {checkPortal} = require('./portal.cjs');
const {seedEditorCards, checkEditorAccess, checkEditorCards} = require('./editor-cards.cjs');
const {audit, checkCoreKeyboard} = require('./accessibility.cjs');
const {checkAdapterBoundaries} = require('./adapter-boundary.cjs');
const {checkDelayedPortalOpen} = require('./portal-interruption.cjs');

const root = path.resolve(__dirname, '../..');
const runtime = process.env.GHOST_RUNTIME_DIR;
const expectedVersion = process.env.GHOST_RUNTIME_VERSION || '6.73.0';
const profiles = {
    '5.130.6': {database: 'sqlite3', portal: '2.51.5', portalPackage: 'portal-ghost5'},
    '6.73.0': {database: 'better-sqlite3', portal: '2.72.11', portalPackage: '@tryghost/portal'},
};
const profile = profiles[expectedVersion];
assert(profile, 'Unsupported disposable Ghost version');
assert(runtime && path.isAbsolute(runtime), 'Set GHOST_RUNTIME_DIR to the disposable unpacked Ghost directory');
assert(!runtime.startsWith(root), 'Ghost test data must live outside the theme repository');
const base = 'http://127.0.0.1:2368';
const out = path.join(root, 'artifacts/runtime');
fs.mkdirSync(out, {recursive: true});
const results = {ghost: expectedVersion, portal: profile.portal, node: process.version, checks: [], limitation: 'Paid access uses complimentary tier fixtures, not Stripe billing. Portal uses a pinned official bundle with only loopback API access. Account checks open the panel; profile/preference saving is not tested. No real email or checkout.'};
const record = (name, error) => {
    results.checks.push({name, status: error ? 'failed' : 'passed', ...(error ? {error} : {})});
    console.log(`${error ? 'FAIL' : 'PASS'} ${name}${error ? ': ' + error : ''}`);
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let ghost;
let browser;
const contexts = [];
const emails = [];
const sockets = new Set();

// Minimal local SMTP sink: accepts messages in memory, never forwards or writes tokens to artifacts.
const smtp = net.createServer(socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => {});
    socket.write('220 localhost test SMTP\r\n');
    let buffer = '', data = false, message = '', recipient = '';
    socket.on('data', chunk => {
        buffer += chunk.toString();
        let pos;
        while ((pos = buffer.indexOf('\r\n')) !== -1) {
            const line = buffer.slice(0, pos); buffer = buffer.slice(pos + 2);
            if (data) {
                if (line === '.') {
                    emails.push({recipient, message}); data = false; message = '';
                    socket.write('250 accepted\r\n');
                } else message += line.replace(/^\.\./, '.') + '\r\n';
            } else if (/^EHLO|^HELO/i.test(line)) socket.write('250-localhost\r\n250 8BITMIME\r\n');
            else if (/^RCPT TO:/i.test(line)) { recipient = line; socket.write('250 OK\r\n'); }
            else if (/^DATA$/i.test(line)) { data = true; socket.write('354 End with dot\r\n'); }
            else if (/^QUIT$/i.test(line)) socket.end('221 Bye\r\n');
            else socket.write('250 OK\r\n');
        }
    });
});

async function context() {
    const ctx = await request.newContext({baseURL: base, extraHTTPHeaders: {Origin: base}, timeout: 30000});
    contexts.push(ctx); return ctx;
}
async function api(ctx, method, route, data, options = {}) {
    const response = await ctx[method](`/ghost/api/admin/${route}`, {...options, ...(data ? {data} : {})});
    assert(response.ok(), `${method} ${route}: ${response.status()} ${(await response.text()).slice(0, 1200)}`);
    if (response.status() === 204) return {};
    return response.headers()['content-type']?.includes('application/json') ? response.json() : {};
}
async function memberLink(email, since = 0) {
    for (let i = 0; i < 50 && !emails.slice(since).some(m => m.recipient.includes(email)); i++) await delay(100);
    const mail = emails.slice(since).findLast(m => m.recipient.includes(email));
    assert(mail, 'Local SMTP sink did not receive sign-in email');
    const parsed = await simpleParser(mail.message);
    const decoded = `${parsed.text || ''}\n${parsed.html || ''}`.replace(/&amp;/g, '&');
    const link = decoded.match(/http:\/\/127\.0\.0\.1:2368\/(?:members\/)?\?token=[^\s<>"']+/)?.[0];
    assert(link, 'No local magic link found');
    return link;
}
async function signIn(email) {
    const ctx = await context();
    const since = emails.length;
    const integrity = await (await ctx.get('/members/api/integrity-token/')).text();
    const response = await ctx.post('/members/api/send-magic-link/', {data: {email, emailType: 'signin', integrityToken: integrity}});
    assert.equal(response.status(), 201, 'Member magic-link request failed');
    const link = await memberLink(email, since);
    await ctx.get(link);
    const home = await (await ctx.get('/')).text();
    assert(home.includes('#/portal/account'), 'Signed-in member did not get Account navigation');
    return ctx;
}

async function main() {
    assert.equal(require(path.join(runtime, 'package.json')).version, results.ghost);
    const runtimeRequire = createRequire(path.join(runtime, 'package.json'));
    const engines = require(path.join(runtime, 'package.json')).engines.node;
    assert(runtimeRequire('semver').satisfies(process.version, engines), `Node ${process.version} must satisfy Ghost's official engines ${engines}`);
    assert(!fs.existsSync(path.join(runtime, 'content/data/ghost-dev.db')), 'Refuse to reuse a database');
    await new Promise(resolve => smtp.listen(2525, '127.0.0.1', resolve));
    fs.writeFileSync(path.join(runtime, 'config.development.json'), JSON.stringify({
        url: base, server: {host: '127.0.0.1', port: 2368},
        database: {client: profile.database, connection: {filename: path.join(runtime, 'content/data/ghost-dev.db')}},
        paths: {contentPath: path.join(runtime, 'content')},
        mail: {transport: 'SMTP', from: 'qa@example.test', options: {host: '127.0.0.1', port: 2525, secure: false, ignoreTLS: true, auth: null}},
        security: {staffDeviceVerification: false}, logging: {transports: ['stdout']},
        privacy: {useUpdateCheck: false, useGravatar: false},
        portal: {url: `${base}/__qa__/portal.min.js`, version: results.portal},
    }, null, 2));
    // Runtime logs can contain authentication URLs; keep them temporary, outside uploaded artifacts.
    const logPath = path.join(runtime, 'runtime.log');
    const log = fs.openSync(logPath, 'w');
    ghost = spawn(process.execPath, ['index.js'], {cwd: runtime, env: {...process.env, NODE_ENV: 'development'}, stdio: ['ignore', log, log]});
    const admin = await context();
    let ready = false;
    for (let i = 0; i < 120; i++) {
        if (ghost.exitCode !== null) throw new Error(`Ghost exited before ready (${ghost.exitCode}). See temporary runtime.log.`);
        try { if ((await admin.get('/ghost/api/admin/authentication/setup/')).ok()) { ready = true; break; } } catch {}
        await delay(1000);
    }
    assert(ready, 'Ghost did not initialize within 120 seconds');
    record('Unmodified Ghost boots and initializes SQLite');
    const password = `Qa!${randomBytes(24).toString('hex')}`;
    await api(admin, 'post', 'authentication/setup/', {setup: [{name: 'QA Researcher', email: 'owner@example.test', password, blogTitle: 'Research QA'}]});
    await api(admin, 'post', 'session/', {username: 'owner@example.test', password});
    const archive = fs.readFileSync(path.join(root, 'dist/ghost-research-pro.zip'));
    await api(admin, 'post', 'themes/upload/', null, {multipart: {file: {name: 'ghost-research-pro.zip', mimeType: 'application/zip', buffer: archive}}});
    await api(admin, 'put', 'themes/ghost-research-pro/activate/');
    const active = await api(admin, 'get', 'themes/active/');
    assert.equal(active.themes[0].name, 'ghost-research-pro');
    assert.equal(active.themes[0].active, true);
    record('Built ZIP uploads and activates through Ghost Admin API');

    const tiers = [];
    for (const name of ['Research A', 'Research B']) {
        const response = await api(admin, 'post', 'tiers/', {tiers: [{name, description: 'Disposable QA tier', monthly_price: 1000, yearly_price: 10000, currency: 'USD'}]});
        tiers.push(response.tiers[0]);
    }
    const definitions = [
        ['public-report', 'public', 'PUBLIC_BODY', []],
        ['members-report', 'members', 'MEMBERS_SECRET_71b', []],
        ['paid-report', 'paid', 'PAID_SECRET_28f', []],
        ['tier-report', 'tiers', 'TIER_A_SECRET_59c', [{id: tiers[0].id}]],
    ];
    for (const [slug, visibility, marker, postTiers] of definitions) {
        await api(admin, 'post', 'posts/?source=html', {posts: [{
            title: slug, slug, status: 'published', visibility, tiers: postTiers,
            custom_excerpt: 'Public summary of a QA research report.', tags: [{name: 'Research', slug: 'research'}],
            html: `<h2>Findings</h2><p>${marker}</p><table><thead><tr><th>Indicator</th><th>Value</th></tr></thead><tbody><tr><td>Sample</td><td>42</td></tr></tbody></table>`,
        }]});
    }
    for (const [slug, template] of [['about', null], ['membership', 'custom-membership']]) {
        await api(admin, 'post', 'pages/?source=html', {pages: [{title: `QA ${slug}`, slug, status: 'published', html: '<p>QA public page body.</p>', custom_template: template}]});
    }
    await seedEditorCards({runtime, base, api, admin});
    const users = await api(admin, 'get', 'users/me/');
    const authorSlug = users.users[0].slug;
    const anon = await context();
    for (const route of ['/', '/public-report/', '/tag/research/', `/author/${authorSlug}/`, '/about/', '/membership/']) {
        const response = await anon.get(route);
        assert.equal(response.status(), 200, route);
        const html = await response.text();
        assert(html.includes('class="site-header wrap"') && html.includes('id="main"'), `${route} not rendered by our theme`);
        record(`Page renders: ${route}`);
    }
    assert.equal((await anon.get('/qa-does-not-exist/')).status(), 404);
    assert.equal((await anon.get('/assets/css/screen.css')).status(), 200);
    record('404 and CSS asset routes');
    const homeHtml = await (await anon.get('/')).text();
    assert.equal((homeHtml.match(/Public summary of a QA research report\./g) || []).length, 4, 'All report cards should show their public custom excerpt');
    record('Restricted report cards retain public summaries');

    const memberData = [];
    for (const label of ['free', 'tier-a', 'tier-b']) {
        const email = `${label}@example.test`;
        const response = await api(admin, 'post', 'members/?send_email=false', {members: [{email, name: `QA ${label}`} ]});
        memberData.push(response.members[0]);
    }
    // Test fixture only: complimentary entitlements need no Stripe connection. Ghost still
    // creates/verifies real login cookies and enforces access via its normal middleware.
    const db = runtimeRequire('knex')({client: profile.database,
        connection: {filename: path.join(runtime, 'content/data/ghost-dev.db')}, useNullAsDefault: true});
    await db.transaction(async trx => {
        for (let i = 1; i <= 2; i++) {
            await trx('members').where({id: memberData[i].id}).update({status: 'comped'});
            await trx('members_products').insert({id: randomBytes(12).toString('hex'), member_id: memberData[i].id,
                product_id: tiers[i - 1].id, sort_order: 0, expiry_at: null});
        }
    });
    await db.destroy();
    const free = await signIn(memberData[0].email);
    const tierA = await signIn(memberData[1].email);
    const tierB = await signIn(memberData[2].email);
    record('Free and complimentary members sign in through captured local magic links');
    for (const [label, ctx, allowed] of [
        ['anonymous', anon, [true, false, false, false]],
        ['free', free, [true, true, false, false]],
        ['tier-a', tierA, [true, true, true, true]],
        ['tier-b', tierB, [true, true, true, false]],
        ['anonymous-after-paid', anon, [true, false, false, false]],
    ]) {
        for (let i = 0; i < definitions.length; i++) {
            const [slug, , marker] = definitions[i];
            const response = await ctx.get(`/${slug}/`);
            assert.equal(response.status(), 200);
            const html = await response.text();
            assert.equal(html.includes(marker), allowed[i], `${label}: ${slug} body access mismatch`);
            if (!allowed[i]) {
                assert(html.includes('gh-post-upgrade-cta'), `${label}: missing restricted-content CTA`);
                assert(!html.includes('class="subscribe"'), `${label}: duplicate subscription CTA`);
                assert(!html.includes('class="member-note"'), `${label}: misleading membership thank-you on locked content`);
            }
            record(`Access ${label} / ${slug}: ${allowed[i] ? 'body visible' : 'body absent from HTML'}`);
        }
    }
    await checkEditorAccess({anon, free, tierA, record});
    await api(admin, 'delete', `members/${memberData[1].id}/sessions/`);
    const revoked = await (await tierA.get('/tier-report/')).text();
    assert(!revoked.includes('TIER_A_SECRET_59c'), 'Revoked member session retained restricted content');
    record('Admin session revocation removes access');

    browser = await chromium.launch({headless: true});
    await checkAdapterBoundaries({browser, out, record});
    await checkDelayedPortalOpen({browser, out, record});
    await checkEditorCards({browser, base, out, record});
    // Explicit free-only publication settings in the disposable instance for Portal checks.
    await api(admin, 'put', 'settings/', {settings: [
        {key: 'paid_members_enabled', value: false},
        {key: 'members_signup_access', value: 'all'},
        {key: 'portal_name', value: true},
    ]});
    try {
        await checkPortal({browser, base, out, record, memberLink, mailCount: () => emails.length, portalPackage: profile.portalPackage});
    } catch (error) { record('Portal free-flow completion', error.message); }
    for (const width of [360, 768, 1440]) {
        const page = await browser.newPage({viewport: {width, height: 1000}});
        // Visual checks are self-contained; no analytics, payment provider or external embeds.
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        for (const slug of ['', 'public-report', 'membership', 'paid-report']) {
            await page.goto(`${base}/${slug ? slug + '/' : ''}`, {waitUntil: 'networkidle'});
            assert.equal(await page.locator('main').count(), 1);
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
            assert(!overflow, `Horizontal overflow at ${width}px on ${slug || 'home'}`);
            await page.screenshot({path: path.join(out, `${slug || 'home'}-${width}.png`), fullPage: true});
            if (width !== 768) await audit(page, {out, label: `${slug || 'home'}-${width}`, record});
        }
        if (width === 1440) await checkCoreKeyboard(page, {base, record});
        if (width === 1440) {
            for (const route of ['/about/', '/tag/research/', `/author/${authorSlug}/`]) {
                await page.goto(`${base}${route}`, {waitUntil: 'networkidle'});
                await audit(page, {out, label: route, record});
            }
        }
        await page.goto(base);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
        await page.keyboard.press('Enter');
        assert(page.url().endsWith('#main'), 'Skip link did not target main');
        await page.close();
        record(`Browser layout and keyboard smoke at ${width}px`);
    }
    assert(!results.checks.some(check => check.status === 'failed'), 'Acceptance checks failed; see results.json and accessibility.json');
    results.status = 'passed';
}

main().catch(error => {
    results.status = 'failed'; results.error = error.message;
    console.error(error.message); process.exitCode = 1;
}).finally(async () => {
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2));
    if (browser) await browser.close();
    for (const ctx of contexts) await ctx.dispose();
    if (ghost && ghost.exitCode === null) {
        ghost.kill('SIGTERM');
        await Promise.race([new Promise(resolve => ghost.once('exit', resolve)), delay(5000)]);
        if (ghost.exitCode === null) ghost.kill('SIGKILL');
    }
    for (const socket of sockets) socket.destroy();
    smtp.close();
});
