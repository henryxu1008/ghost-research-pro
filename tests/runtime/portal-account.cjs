const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe, audit} = require('./accessibility.cjs');

async function checkAccount({page, ctx, base, out, record, mailCount, screenshot}) {
    const evidence = [];
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    const memberURL = url => url.origin === base && url.pathname.replace(/\/$/, '') === '/members/api/member';
    const isWrite = response => memberURL(new URL(response.url())) && response.request().method() === 'PUT';
    let writes = 0;
    const countWrite = request => { if (memberURL(new URL(request.url())) && request.method() === 'PUT') writes++; };
    page.on('request', countWrite);
    const readMember = async () => {
        const response = await ctx.request.get(`${base}/members/api/member/`);
        assert(response.status() === 200, 'Expected an authenticated disposable member');
        return response.json();
    };
    const home = async () => {
        await page.goto(base, {waitUntil: 'networkidle'});
        await page.locator('.member-actions a[href="#/portal/account"]').click();
        await popup().getByRole('heading', {name: 'Your account', exact: true}).waitFor();
    };
    // Native buttons in Portal 2.51; keyboard-operable rows in Portal 2.72.
    const activate = async selector => {
        const marker = popup().locator(selector);
        const button = await marker.evaluate(el => el.tagName === 'BUTTON');
        const target = button ? marker : marker.locator('xpath=..');
        if (!button) assert(await target.getAttribute('role') === 'button', 'Account action row lacks button semantics');
        await target.focus();
        await target.press('Enter');
    };
    const profile = async () => {
        await home();
        await activate('[data-test-button="edit-profile"]');
        await popup().getByLabel('Name', {exact: true}).waitFor();
    };
    const preferences = async () => {
        await home();
        const manage = popup().locator('[data-test-button="manage-newsletters"]');
        if (await manage.count()) {
            await activate('[data-test-button="manage-newsletters"]');
            await popup().getByRole('heading', {name: 'Email preferences', exact: true}).waitFor();
            const row = popup().locator('[data-testid="newsletter-toggle"]').first();
            return {row, box: row.locator('.gh-portal-for-switch'), input: row.locator('input[type="checkbox"]')};
        }
        const box = popup().locator('[data-test-switch="default-newsletter-toggle"]');
        await box.waitFor();
        return {row: box, box, input: box.locator('input[type="checkbox"]')};
    };
    const waitChecked = async (control, checked) => {
        const id = await control.input.getAttribute('id');
        await page.waitForFunction(({id, checked}) => document.querySelector('iframe[title="portal-popup"]')
            ?.contentDocument?.getElementById(id)?.checked === checked, {id, checked});
    };
    const saveName = async label => {
        const [response] = await Promise.all([
            page.waitForResponse(isWrite), popup().getByRole('button', {name: label, exact: true}).click(),
        ]);
        assert(response.status() === 200, 'Profile save did not reach the real Ghost API');
        await popup().getByRole('heading', {name: 'Your account', exact: true}).waitFor();
    };
    const toggle = async (control, keyboard = false) => {
        const [response] = await Promise.all([
            page.waitForResponse(isWrite),
            keyboard ? control.row.press('Space') : control.box.locator('.input-toggle-component').click(),
        ]);
        assert(response.status() === 200, 'Preference save did not reach the real Ghost API');
    };
    const subscribed = member => Boolean(member.newsletters?.length);
    const run = async (name, action) => {
        const entry = {name, status: 'failed'};
        evidence.push(entry);
        await probe(record, name, async () => { await action(entry); entry.status = 'passed'; });
    };
    const markers = ['PROFILE_SAVED_06f', 'PROFILE_RETRY_17a', 'PROFILE_CANCEL_28b'];
    const initialMail = mailCount();
    try {
        await run('Portal profile saves a fixture name and survives reload at 360px', async () => {
            await page.setViewportSize({width: 360, height: 1000});
            await profile();
            const before = await readMember();
            await popup().getByLabel('Name', {exact: true}).fill(markers[0]);
            await saveName('Save');
            const saved = await readMember();
            assert(saved.name === markers[0] && saved.email === before.email, 'Profile persistence or email isolation failed');
            await profile();
            assert(await popup().getByLabel('Name', {exact: true}).inputValue() === markers[0], 'Reload lost saved fixture name');
            await screenshot('portal-profile-360.png');
            const frame = await (await page.locator('iframe[title="portal-popup"]').elementHandle()).contentFrame();
            await audit(frame, {out, label: 'portal-profile-360', record});
        });
        await run('Portal failed profile save retains input and retries against Ghost at 1440px', async entry => {
            await page.setViewportSize({width: 1440, height: 1000});
            await profile();
            const before = await readMember();
            await popup().getByLabel('Name', {exact: true}).fill(markers[1]);
            let attempts = 0;
            const fail = route => route.request().method() === 'PUT' ? (attempts++, route.abort('failed')) : route.fallback();
            await page.route(memberURL, fail);
            try {
                await popup().getByRole('button', {name: 'Save', exact: true}).click();
                await popup().getByRole('button', {name: 'Retry', exact: true}).waitFor();
                assert(await popup().getByLabel('Name', {exact: true}).inputValue() === markers[1], 'Failed save lost the draft');
                assert((await readMember()).name === before.name, 'Aborted save changed server state');
                assert(attempts === 1, 'Failure path retried without an explicit retry');
            } finally { await page.unroute(memberURL, fail); }
            await saveName('Retry');
            await profile();
            assert(await popup().getByLabel('Name', {exact: true}).inputValue() === markers[1], 'Retry did not persist the draft');
            entry.fault = 'one aborted loopback PUT';
            entry.attemptsBeforeExplicitRetry = attempts;
        });
        await run('Portal profile Back and close discard unsaved changes without writes', async () => {
            await profile();
            const saved = await readMember();
            const before = writes;
            await popup().getByLabel('Name', {exact: true}).fill(markers[2]);
            await popup().getByRole('button', {name: 'Back', exact: true}).click();
            await popup().getByRole('heading', {name: 'Your account', exact: true}).waitFor();
            await activate('[data-test-button="edit-profile"]');
            assert(await popup().getByLabel('Name', {exact: true}).inputValue() === saved.name, 'Back retained an unsaved draft');
            await popup().getByLabel('Name', {exact: true}).fill(markers[2]);
            await popup().getByRole('button', {name: 'Close popup', exact: true}).click();
            await page.locator('iframe[title="portal-popup"]').waitFor({state: 'detached'});
            await profile();
            assert(await popup().getByLabel('Name', {exact: true}).inputValue() === saved.name, 'Close retained an unsaved draft');
            assert(writes === before && (await readMember()).name === saved.name, 'Cancel sent a profile write');
        });
        await run('Portal newsletter changes persist after reload and restore the original preference', async () => {
            let control = await preferences();
            const before = subscribed(await readMember());
            await toggle(control);
            await waitChecked(control, !before);
            assert(subscribed(await readMember()) === !before, 'Newsletter save did not persist');
            control = await preferences();
            await waitChecked(control, !before);
            await toggle(control);
            await waitChecked(control, before);
            assert(subscribed(await readMember()) === before, 'Newsletter restoration failed');
            await screenshot('portal-preferences-1440.png');
            const frame = await (await page.locator('iframe[title="portal-popup"]').elementHandle()).contentFrame();
            await audit(frame, {out, label: 'portal-preferences-1440', record});
        });
        await run('Portal failed newsletter save preserves the draft and reopening restores server state', async entry => {
            let control = await preferences();
            const before = subscribed(await readMember());
            let attempts = 0;
            const fail = route => route.request().method() === 'PUT' ? (attempts++, route.abort('failed')) : route.fallback();
            await page.route(memberURL, fail);
            try {
                await control.box.locator('.input-toggle-component').click();
                await popup().getByText('Failed to update newsletter settings', {exact: true}).waitFor();
                await waitChecked(control, !before);
                assert(subscribed(await readMember()) === before, 'Aborted preference save changed server state');
                assert(attempts === 1, 'Preference failure retried without interaction');
            } finally { await page.unroute(memberURL, fail); }
            control = await preferences();
            await waitChecked(control, before);
            await toggle(control);
            assert(subscribed(await readMember()) === !before, 'Preference could not be saved after failure');
            control = await preferences();
            await toggle(control);
            assert(subscribed(await readMember()) === before, 'Preference recovery did not restore the original value');
            entry.fault = 'one aborted loopback PUT';
        });
        await run('Portal newsletter keyboard activation persists and restores the preference', async () => {
            const control = await preferences();
            const before = subscribed(await readMember());
            const role = await control.row.getAttribute('role');
            assert(['button', 'switch'].includes(role), 'Newsletter control lacks keyboard semantics');
            await control.row.focus();
            await toggle(control, true);
            await waitChecked(control, !before);
            assert(subscribed(await readMember()) === !before, 'Keyboard preference change did not reach Ghost');
            await toggle(control, true);
            await waitChecked(control, before);
            assert(subscribed(await readMember()) === before, 'Keyboard preference restoration failed');
        });
        await run('Portal signout removes fixture profile data from HTML, API and reopened UI', async () => {
            assert(mailCount() === initialMail, 'Profile or preference flow sent unexpected mail');
            const member = await readMember();
            await home();
            await page.goto(`${base}/membership/`, {waitUntil: 'networkidle'});
            await page.locator('.member-actions a[href="#/portal/account"]').click();
            await popup().getByRole('button', {name: 'logout', exact: true}).click();
            await page.locator('.member-actions a[href="#/portal/signin"]').waitFor();
            const privateValues = [...markers, member.email];
            for (const route of ['/', '/membership/', '/members-report/']) {
                const html = await (await ctx.request.get(base + route)).text();
                assert(privateValues.every(value => !html.includes(value)), 'Anonymous HTML contains fixture profile data');
            }
            const response = await ctx.request.get(`${base}/members/api/member/`);
            assert([204, 401].includes(response.status()), 'Signed-out member API still returns a profile');
            const body = await response.text();
            assert(privateValues.every(value => !body.includes(value)), 'Signed-out member API leaks fixture data');
            await page.goBack({waitUntil: 'networkidle'});
            await page.locator('.member-actions a[href="#/portal/signin"]').waitFor();
            const backHtml = await page.content();
            assert(privateValues.every(value => !backHtml.includes(value)), 'Back navigation restored fixture profile data');
            await page.goto(`${base}/#/portal/account`, {waitUntil: 'networkidle'});
            await popup().getByLabel('Email', {exact: true}).waitFor();
            assert(await popup().getByLabel('Email', {exact: true}).inputValue() === '', 'Signed-out form retained member email');
            const text = await popup().locator('body').innerText();
            assert(privateValues.every(value => !text.includes(value)), 'Signed-out Portal UI contains fixture profile data');
            assert(mailCount() === initialMail, 'Signed-out account recovery sent unexpected mail');
        });
    } finally {
        page.off('request', countWrite);
        fs.writeFileSync(path.join(out, 'account-results.json'), JSON.stringify(evidence, null, 2));
    }
}

module.exports = {checkAccount};
