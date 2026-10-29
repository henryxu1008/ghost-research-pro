const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const {probe} = require('./accessibility.cjs');

async function checkMembershipSettings({browser, admin, base, out, root, runtime, portalPackage, contexts, record}) {
    const report = {scope: 'Real signup settings and native member sessions; paid role is complimentary, not a Stripe subscription. Paid-enabled template fixtures are render-only; no checkout.', checks: [], renderFixtures: [], blockedPayments: [], externalRequestsBlocked: []};
    const settings = async () => {
        const response = await admin.get(`${base}/ghost/api/admin/settings/`);
        assert.equal(response.status(), 200);
        return Object.fromEntries((await response.json()).settings
            .filter(item => ['members_signup_access', 'paid_members_enabled', 'allow_self_signup', 'members_invite_only'].includes(item.key))
            .map(item => [item.key, item.value]));
    };
    const setMode = async value => {
        const response = await admin.put(`${base}/ghost/api/admin/settings/`, {data: {settings: [{key: 'members_signup_access', value}]}});
        assert.equal(response.status(), 200, 'Disposable signup access update rejected');
        const state = await settings();
        assert.equal(state.members_signup_access, value, 'Signup setting did not persist');
        return state;
    };
    const before = await settings();
    const active = await admin.get(`${base}/ghost/api/admin/themes/active/`);
    assert.equal(active.status(), 200);
    assert.equal((await active.json()).themes[0].name, 'ghost-research-pro', 'Membership probes must use the actual installed theme');
    report.before = before;
    const owned = [];
    const bundle = path.join(path.dirname(require.resolve(`${portalPackage}/package.json`)), 'umd/portal.min.js');
    const run = async (name, fn) => {
        const entry = {name, status: 'failed'}; report.checks.push(entry);
        await probe(record, name, async () => {
            try {await fn(entry); entry.status = 'passed';}
            catch (error) {entry.error = error.message; throw error;}
        });
    };
    try {
        // Rendering only: exercise the real pinned Ghost equality helper with
        // published @site values, without forging a Stripe connection or write.
        await run('Membership render fixtures retain paid plan links and suppress invite-only signup (no billing)', async () => {
            const hbs = createRequire(require.resolve('gscan/package.json'))('handlebars').create();
            hbs.registerHelper('match', require(path.join(runtime, 'core/frontend/helpers/match.js')));
            const render = hbs.compile(fs.readFileSync(path.join(root, 'custom-membership.hbs'), 'utf8'));
            for (const mode of ['all', 'paid', 'invite']) {
                const html = render({post: {title: 'Membership', content: 'Fixture introduction'}}, {data: {
                    site: {members_signup_access: mode, allow_self_signup: mode !== 'invite', members_invite_only: mode === 'invite', members_enabled: true, paid_members_enabled: true},
                    page: {show_title_and_feature_image: true}, member: null,
                }});
                const item = {mode, kind: 'render-only paid-enabled public configuration', freeInvitation: html.includes('Join for free'),
                    paidEntry: html.includes('View plans'), signupLinks: (html.match(/href="#\/portal\/signup"/g) || []).length};
                report.renderFixtures.push(item);
                assert.equal(item.freeInvitation, mode === 'all', `${mode}: incorrect free invitation`);
                assert.equal(item.paidEntry, mode !== 'invite', `${mode}: incorrect paid entry`);
                assert.equal(item.signupLinks, mode === 'invite' ? 0 : mode === 'all' ? 2 : 1, `${mode}: incorrect signup links`);
            }
        });
        for (const [role, request] of Object.entries(contexts)) {
            const response = await request.get(`${base}/paid-report/`);
            assert.equal(response.status(), 200);
            assert.equal((await response.text()).includes('PAID_SECRET_28f'), role === 'complimentary-paid', 'Member fixture access does not match its role');
        }
        const readers = [];
        for (const [role, request] of Object.entries(contexts)) {
            const context = await browser.newContext({storageState: await request.storageState(), viewport: {width: 1280, height: 900}});
            owned.push(context);
            await context.route('**/*', route => {
                const url = new URL(route.request().url());
                if (url.origin === base && url.pathname === '/__qa__/portal.min.js') return route.fulfill({contentType: 'application/javascript', body: fs.readFileSync(bundle)});
                if (url.origin === base && !/checkout|billing|stripe/i.test(url.pathname)) return route.continue();
                const list = url.origin === base ? report.blockedPayments : report.externalRequestsBlocked;
                const label = url.origin + url.pathname; if (!list.includes(label)) list.push(label);
                return route.abort();
            });
            readers.push({role, page: await context.newPage()});
        }
        for (const mode of ['all', 'paid', 'invite']) {
            const state = await setMode(mode);
            assert.equal(state.paid_members_enabled, false, 'Runtime fixture must have no Stripe-enabled paid signup');
            for (const {role, page} of readers) await run(`Membership signup ${mode} / ${role}: correct visible entry points`, async entry => {
                entry.setting = state; entry.routes = [];
                for (const route of ['/membership/', '/', '/public-report/']) {
                    const response = await page.goto(base + route, {waitUntil: 'networkidle'});
                    assert.equal(response.status(), 200);
                    assert.equal(await page.locator('.site-header.wrap').count(), 1, 'Route is not rendered by the installed research theme');
                    const links = await page.locator('a[href^="#/portal/"]').evaluateAll(nodes => nodes.map(node => ({href: node.getAttribute('href'), text: node.textContent.trim()})));
                    entry.routes.push({route, links});
                    await page.screenshot({path: path.join(out, `membership-${mode}-${role}-${route === '/' ? 'home' : route.replace(/\//g, '')}.png`), fullPage: true, animations: 'disabled'});
                    const signup = links.filter(link => link.href === '#/portal/signup');
                    if (role === 'anonymous') {
                        assert(links.some(link => link.href === '#/portal/signin'), 'Existing-member sign in is missing');
                        assert.equal(signup.length > 0, mode === 'all', `${mode}: anonymous signup entry does not match real availability`);
                        if (route === '/membership/') {
                            assert.equal(await page.getByRole('link', {name: 'Join for free', exact: true}).count(), mode === 'all' ? 1 : 0, 'Free invitation does not match signup access');
                            assert((await page.locator('.membership-plan').count()) > 0, 'Membership page has no useful state');
                        }
                    } else {
                        assert(links.some(link => link.href === '#/portal/account'), 'Signed-in account entry is missing');
                        assert.equal(signup.length, 0, 'Existing member is invited to sign up again');
                        if (route === '/membership/') assert.equal(await page.getByRole('link', {name: 'Manage membership', exact: true}).count(), 1, 'Membership management entry is missing');
                    }
                }
            });
        }
        assert.equal(report.blockedPayments.length, 0, 'Membership page attempted a payment endpoint');
    } finally {
        for (const context of owned) await context.close();
        await run('Membership signup access is restored after configuration probes', async () => {
            report.after = await setMode(before.members_signup_access);
            assert.deepEqual(report.after, before, 'Signup settings were not restored');
        });
        fs.writeFileSync(path.join(out, 'membership-settings.json'), JSON.stringify(report, null, 2));
    }
}

module.exports = {checkMembershipSettings};
