// Real Portal UI + real disposable Ghost APIs. No mocked member responses or Stripe calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

module.exports.checkPortal = async function checkPortal({browser, base, out, record, memberLink, mailCount}) {
    const bundle = path.join(path.dirname(require.resolve('@tryghost/portal/package.json')), 'umd/portal.min.js');
    const ctx = await browser.newContext({viewport: {width: 360, height: 1000}});
    const forbidden = [];
    let bundleLoads = 0;
    await ctx.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin === base && url.pathname === '/__qa__/portal.min.js') {
            bundleLoads++;
            return route.fulfill({contentType: 'application/javascript', body: fs.readFileSync(bundle)});
        }
        if (url.origin === base && !/checkout|billing|stripe/i.test(url.pathname)) return route.continue();
        // Fonts, telemetry and all payment endpoints stay offline. Store no query strings/tokens.
        if (/checkout|billing/i.test(url.hostname + url.pathname) || (url.hostname.includes('stripe') && url.pathname !== '/v3/')) forbidden.push(url.origin + url.pathname);
        return route.abort();
    });
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    const email = 'portal-free@example.test';
    const screenshot = name => page.screenshot({path: path.join(out, name), fullPage: true});
    const hasBody = async (slug, marker, expected) => {
        const response = await ctx.request.get(`${base}/${slug}/`);
        assert.equal(response.status(), 200);
        assert.equal((await response.text()).includes(marker), expected, `Portal member access: ${slug}`);
    };
    const redeem = async since => {
        const link = await memberLink(email, since);
        // Playwright navigation errors include URLs; keep authentication URLs out of evidence.
        try { await page.goto(link, {waitUntil: 'networkidle'}); }
        catch { throw new Error('Portal member confirmation navigation failed'); }
        await page.goto(base, {waitUntil: 'networkidle'});
        await page.locator('.member-actions a[href="#/portal/account"]').waitFor({state: 'visible'});
    };
    const submitLink = async label => {
        const [response] = await Promise.all([
            page.waitForResponse(r => new URL(r.url()).pathname === '/members/api/send-magic-link/' && r.request().method() === 'POST'),
            popup().getByRole('button', {name: label, exact: true}).click(),
        ]);
        assert.equal(response.status(), 201, 'Portal magic-link submission');
        await popup().getByRole('heading', {name: 'Now check your email!', exact: true}).waitFor({state: 'visible'});
    };
    try {
        await page.goto(`${base}/membership/`, {waitUntil: 'networkidle'});
        // A free-only publication must not advertise an unavailable paid plan card.
        assert.equal(await page.getByRole('heading', {name: 'Premium research', exact: true}).count(), 0);
        await page.getByRole('link', {name: 'Join for free', exact: true}).click();
        await popup().getByLabel('Email', {exact: true}).waitFor({state: 'visible'});
        assert(bundleLoads > 0, 'The pinned official Portal bundle did not load');
        const name = popup().getByLabel('Name', {exact: true});
        if (await name.count()) await name.fill('Portal QA');
        await screenshot('portal-signup-360.png');
        record('Membership free CTA opens official Portal at 360px; unavailable paid card is absent');

        const beforeInvalid = mailCount();
        await popup().getByLabel('Email', {exact: true}).fill('invalid-address');
        await popup().getByRole('button', {name: 'Sign up', exact: true}).click();
        await popup().locator('input[name="email"][aria-invalid="true"]').waitFor({state: 'visible'});
        assert.equal(mailCount(), beforeInvalid, 'Invalid email sent a message');
        record('Portal rejects invalid signup email before sending');

        await popup().getByLabel('Email', {exact: true}).fill(email);
        const signupMail = mailCount();
        await submitLink('Sign up');
        await redeem(signupMail);
        await hasBody('members-report', 'MEMBERS_SECRET_71b', true);
        await hasBody('paid-report', 'PAID_SECRET_28f', false);
        await hasBody('tier-report', 'TIER_A_SECRET_59c', false);
        record('Portal free signup confirms through local mail and grants only free member access');

        await page.goto(`${base}/membership/`, {waitUntil: 'networkidle'});
        assert.equal(await page.getByRole('link', {name: 'Join for free', exact: true}).count(), 0);
        await page.getByRole('link', {name: 'Manage membership', exact: true}).click();
        await popup().getByRole('heading', {name: 'Your account', exact: true}).waitFor({state: 'visible'});
        await screenshot('portal-account-360.png');
        record('Signed-in membership page offers account management instead of duplicate signup');
        await popup().getByRole('button', {name: 'logout', exact: true}).click();
        await page.locator('.member-actions a[href="#/portal/signin"]').waitFor({state: 'visible'});
        await hasBody('members-report', 'MEMBERS_SECRET_71b', false);
        await hasBody('paid-report', 'PAID_SECRET_28f', false);
        record('Portal signout removes member HTML access');

        await page.setViewportSize({width: 1440, height: 1000});
        await page.getByRole('link', {name: 'Sign in', exact: true}).click();
        await popup().getByLabel('Email', {exact: true}).fill(email);
        await screenshot('portal-signin-1440.png');
        const signinMail = mailCount();
        await submitLink('Continue');
        await redeem(signinMail);
        await hasBody('members-report', 'MEMBERS_SECRET_71b', true);
        await hasBody('paid-report', 'PAID_SECRET_28f', false);
        record('Portal desktop signin restores free access through local mail');
        await page.getByRole('link', {name: 'Account', exact: true}).click();
        await popup().getByRole('heading', {name: 'Your account', exact: true}).waitFor({state: 'visible'});
        record('Theme header Account link opens real Portal account UI');
        assert.deepEqual(forbidden, [], 'Portal attempted a payment endpoint');
        record('Portal free flows request no checkout or billing endpoints');
    } finally {
        await ctx.close();
    }
};
