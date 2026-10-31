const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

// The notification flag only: no comment is posted and no email is delivered.
const otherState = member => JSON.stringify({name: member.name, email: member.email,
    newsletters: (member.newsletters || []).map(item => item.id).sort(),
    announcements: member.enable_updates_and_announcements});

async function checkCommentPreferences({page, out, record, mailCount, home, activate, clickSwitch,
    waitChecked, readMember, memberURL, isWrite}) {
    const evidence = [];
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    const open = async () => {
        await home();
        await activate('[data-test-button="manage-newsletters"]');
        await popup().getByRole('heading', {name: 'Email preferences', exact: true}).waitFor();
        const input = popup().locator('input#comments');
        await input.waitFor({state: 'attached'});
        const box = input.locator('xpath=ancestor::div[contains(@class,"gh-portal-for-switch")][1]');
        const row = box.locator('xpath=ancestor::section[1]');
        const target = await row.getAttribute('role') === 'button' ? row : box;
        return {input, box, row: target};
    };
    const assertState = async (control, expected) => {
        await waitChecked(control, expected);
        const role = await control.row.getAttribute('role');
        assert(['switch', 'button'].includes(role), 'Comment control lacks keyboard semantics');
        assert(await control.row.getAttribute(role === 'switch' ? 'aria-checked' : 'aria-pressed') === String(expected),
            'Comment accessible state does not match the saved value');
    };
    const run = async (name, action) => {
        const entry = {name, status: 'failed', requests: [], responses: []};
        evidence.push(entry);
        const observe = request => {
            if (memberURL(new URL(request.url())) && request.method() === 'PUT') {
                const body = request.postDataJSON();
                entry.requests.push({keys: Object.keys(body).sort(), comments: body.enable_comment_notifications});
            }
        };
        page.on('request', observe);
        await probe(record, name, async () => {
            try { await action(entry); entry.status = 'passed'; }
            finally { await page.screenshot({path: path.join(out, `comment-preferences-${evidence.length}.png`), fullPage: true, animations: 'disabled'}); }
        });
        page.off('request', observe);
    };
    const realWrite = async (entry, action) => {
        const [response] = await Promise.all([page.waitForResponse(isWrite), action()]);
        entry.responses.push(response.status());
        assert(response.status() === 200, 'Comment preference write did not reach real Ghost');
    };
    try {
        await run('Portal comment graphic-center saves, reloads and restores at 360px', async entry => {
            await page.setViewportSize({width: 360, height: 1000});
            const before = await readMember(), initialMail = mailCount();
            assert(typeof before.enable_comment_notifications === 'boolean', 'Comment preference is missing from member API');
            let control = await open();
            await assertState(control, before.enable_comment_notifications);
            await realWrite(entry, async () => { entry.hit = await clickSwitch(control); });
            assert((await readMember()).enable_comment_notifications === !before.enable_comment_notifications, 'Comment pointer save was not persisted');
            control = await open();
            await assertState(control, !before.enable_comment_notifications);
            entry.reloadPersisted = true;
            await realWrite(entry, () => clickSwitch(control));
            control = await open();
            await assertState(control, before.enable_comment_notifications);
            entry.restored = (await readMember()).enable_comment_notifications === before.enable_comment_notifications;
            entry.otherFieldsUnchanged = otherState(await readMember()) === otherState(before);
            entry.noMail = mailCount() === initialMail;
            assert(entry.restored && entry.otherFieldsUnchanged && entry.noMail, 'Comment restoration/isolation failed');
            assert(entry.requests.length === 2 && entry.requests.every(request => request.keys.join() === 'enable_comment_notifications'), 'Comment graphic click wrote unexpected fields or duplicated a request');
        });
        await run('Portal comment keyboard Space/Enter persists through reload and restores at 1440px', async entry => {
            await page.setViewportSize({width: 1440, height: 1000});
            const before = await readMember(), initialMail = mailCount();
            let control = await open();
            await control.row.focus();
            await realWrite(entry, () => control.row.press('Space'));
            assert((await readMember()).enable_comment_notifications === !before.enable_comment_notifications, 'Space did not persist comment preference');
            control = await open();
            await assertState(control, !before.enable_comment_notifications);
            entry.reloadPersisted = true;
            await control.row.focus();
            await realWrite(entry, () => control.row.press('Enter'));
            control = await open();
            await assertState(control, before.enable_comment_notifications);
            entry.restored = (await readMember()).enable_comment_notifications === before.enable_comment_notifications;
            entry.otherFieldsUnchanged = otherState(await readMember()) === otherState(before);
            entry.noMail = mailCount() === initialMail;
            assert(entry.restored && entry.otherFieldsUnchanged && entry.noMail && entry.requests.length === 2, 'Comment keyboard roundtrip/isolation failed');
            assert(entry.requests.every(request => request.keys.join() === 'enable_comment_notifications'), 'Keyboard request changed unrelated fields');
        });
        await run('Portal aborted comment save reports failure without false success, then explicitly recovers', async entry => {
            const before = await readMember(), initialMail = mailCount();
            let control = await open();
            // Record transient notifications too: a later error must not hide an
            // earlier success message from the same failed request.
            await popup().locator('body').evaluate(body => {
                const messages = {success: false, failure: false};
                const events = [], started = performance.now();
                const observe = () => {
                    for (const [kind, text] of [['success', 'Comment preferences updated.'], ['failure', 'Failed to update newsletter settings']]) {
                        if (!messages[kind] && body.textContent.includes(text)) {
                            messages[kind] = true;
                            events.push({kind, phase: body.__commentProbe.phase, atMs: Math.round(performance.now() - started)});
                        }
                    }
                };
                const observer = new MutationObserver(observe);
                observer.observe(body, {childList: true, subtree: true, characterData: true});
                body.__commentProbe = {messages, events, observer, phase: 'pending'};
            });
            let attempts = 0;
            const fail = async route => {
                if (route.request().method() !== 'PUT') return route.fallback();
                attempts++;
                // A bounded pair of render frames exposes premature feedback
                // while this controlled request is still pending.
                await popup().locator('body').evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                entry.pendingFeedback = await popup().locator('body').evaluate(body => ({...body.__commentProbe.messages}));
                await page.screenshot({path: path.join(out, 'comment-preferences-pending.png'), fullPage: true, animations: 'disabled'});
                await popup().locator('body').evaluate(body => { body.__commentProbe.phase = 'aborted'; });
                await route.abort('failed');
            };
            await page.route(memberURL, fail);
            try {
                const failed = page.waitForEvent('requestfailed', request => memberURL(new URL(request.url())) && request.method() === 'PUT');
                await clickSwitch(control);
                await failed;
                await popup().getByText('Failed to update newsletter settings', {exact: true}).waitFor();
                const observed = await popup().locator('body').evaluate(body => {
                    const probe = body.__commentProbe;
                    probe.observer.disconnect(); delete body.__commentProbe;
                    return {feedback: probe.messages, feedbackEvents: probe.events};
                });
                Object.assign(entry, observed);
                entry.serverUnchanged = (await readMember()).enable_comment_notifications === before.enable_comment_notifications && otherState(await readMember()) === otherState(before);
                entry.clientAccountRetained = await popup().locator('.gh-portal-content').count() === 1;
                entry.attemptsBeforeExplicitRetry = attempts;
                await page.screenshot({path: path.join(out, 'comment-preferences-aborted.png'), fullPage: true, animations: 'disabled'});
            } finally { await page.unroute(memberURL, fail); }
            control = await open();
            await assertState(control, before.enable_comment_notifications);
            await realWrite(entry, () => clickSwitch(control));
            control = await open();
            await assertState(control, !before.enable_comment_notifications);
            entry.retryReloadPersisted = true;
            await realWrite(entry, () => clickSwitch(control));
            control = await open();
            await assertState(control, before.enable_comment_notifications);
            entry.restored = (await readMember()).enable_comment_notifications === before.enable_comment_notifications;
            entry.noMail = mailCount() === initialMail;
            entry.failedAssertions = [
                ['server unchanged', entry.serverUnchanged], ['client account retained', entry.clientAccountRetained],
                ['one fault attempt', attempts === 1], ['clear error without false success', entry.feedback.failure && !entry.feedback.success],
                ['real retry persists and restores', entry.retryReloadPersisted && entry.restored],
                ['no mail', entry.noMail], ['three attempts total', entry.requests.length === 3],
                ['only comment flag written', entry.requests.every(request => request.keys.join() === 'enable_comment_notifications')],
            ].filter(([, passed]) => !passed).map(([name]) => name);
            assert(entry.failedAssertions.length === 0, entry.failedAssertions.join('; '));
        });
    } finally { fs.writeFileSync(path.join(out, 'comment-preferences.json'), JSON.stringify(evidence, null, 2)); }
}

module.exports = {checkCommentPreferences};
