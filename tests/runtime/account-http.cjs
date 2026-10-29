const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

const stateOf = member => JSON.stringify({name: member.name, email: member.email,
    newsletters: (member.newsletters || []).map(item => item.id).sort(),
    comments: member.enable_comment_notifications, announcements: member.enable_updates_and_announcements});

async function checkAccountHTTP({page, out, record, mailCount, profile, preferences, clickSwitch,
    waitChecked, readMember, memberURL, isWrite}) {
    const evidence = [];
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    try {
        for (const status of [503, 429]) for (const kind of ['profile', 'newsletter']) {
            const entry = {kind, injectedStatus: status, status: 'failed', requests: [], responses: []};
            evidence.push(entry);
            await probe(record, `Portal ${kind} HTTP ${status} preserves draft/session and explicitly recovers`, async () => {
                let phase = 'fault', firstResponseAt;
                const started = performance.now();
                const requestObserver = request => {
                    if (memberURL(new URL(request.url())) && request.method() === 'PUT') {
                        entry.requests.push({phase, atMs: Math.round(performance.now() - started)});
                    }
                };
                const fail = async route => {
                    if (route.request().method() !== 'PUT') return route.fallback();
                    return route.fulfill({status, contentType: 'application/json', headers: {'Retry-After': '1'},
                        body: JSON.stringify({errors: [{message: `Controlled QA HTTP ${status} save failure`,
                            type: status === 429 ? 'TooManyRequestsError' : 'InternalServerError'}]})});
                };
                const realWrite = async action => {
                    const [response] = await Promise.all([page.waitForResponse(isWrite), action()]);
                    entry.responses.push({phase, status: response.status()});
                    assert(response.status() === 200, 'Recovery must reach the real Ghost API');
                    return response;
                };
                page.on('request', requestObserver);
                try {
                    const before = await readMember();
                    const beforeState = stateOf(before);
                    const initialMail = mailCount();
                    const draft = `HTTP_PROFILE_${status}_d8c`;
                    const desired = !Boolean(before.newsletters?.length);
                    let control, inputId;
                    if (kind === 'profile') {
                        await profile();
                        await popup().getByLabel('Name', {exact: true}).fill(draft);
                    } else {
                        control = await preferences();
                        inputId = await control.input.getAttribute('id');
                    }
                    await page.route(memberURL, fail);
                    const [failureResponse] = await Promise.all([
                        page.waitForResponse(isWrite),
                        kind === 'profile' ? popup().getByRole('button', {name: 'Save', exact: true}).click() : clickSwitch(control),
                    ]);
                    await failureResponse.finished();
                    firstResponseAt = performance.now();
                    entry.responses.push({phase, status: failureResponse.status(), retryAfter: failureResponse.headers()['retry-after']});
                    // Observe either the expected failure feedback or loss of the
                    // account UI; a disappeared form is a failure, never a pass.
                    await page.waitForFunction(() => {
                        const doc = document.querySelector('iframe[title="portal-popup"]')?.contentDocument;
                        if (!doc?.body) return false;
                        return /Failed to update|Controlled QA/.test(doc.body.textContent) || !doc.querySelector('.gh-portal-content');
                    });
                    const observed = await popup().locator('body').evaluate((body, {kind, draft, desired, inputId}) => {
                        const text = body.textContent;
                        const name = body.querySelector('input[name="name"]');
                        const newsletter = body.ownerDocument.getElementById(inputId);
                        return {draftRetained: kind === 'profile' ? name?.value === draft : newsletter?.checked === desired,
                            failureFeedback: /Failed to update|Controlled QA/.test(text),
                            falseSuccess: /Email preferences updated\.|Account details updated successfully/.test(text),
                            clientAccountRetained: Boolean(body.querySelector('.gh-portal-content')),
                            profileRetryAvailable: [...body.querySelectorAll('button')].some(button => button.textContent.trim() === 'Retry')};
                    }, {kind, draft, desired, inputId});
                    Object.assign(entry, observed);
                    const unchanged = await readMember();
                    entry.serverSessionRetained = true;
                    entry.serverUnchanged = stateOf(unchanged) === beforeState;
                    await page.screenshot({path: path.join(out, `account-http-${kind}-${status}-fault.png`), fullPage: true, animations: 'disabled'});
                    // The simulated user waits for the supplied header. This records
                    // behavior; it does not claim Portal enforces a UI cooldown.
                    await new Promise(resolve => setTimeout(resolve, Math.max(0, Math.ceil(firstResponseAt + 1000 - performance.now())) + 10));
                    entry.faultAttempts = entry.requests.filter(request => request.phase === 'fault').length;
                    await page.unroute(memberURL, fail);
                    phase = 'retry';
                    entry.explicitRetryDelayMs = Math.round(performance.now() - firstResponseAt);
                    if (kind === 'profile') {
                        if (observed.draftRetained && observed.profileRetryAvailable) {
                            entry.retryMode = 'same-form Retry';
                            await realWrite(() => popup().getByRole('button', {name: 'Retry', exact: true}).click());
                        } else {
                            // Diagnostic recovery keeps later cases independent, but
                            // cannot make the lost-draft assertions below pass.
                            entry.retryMode = 'reopen after lost draft';
                            await profile();
                            await popup().getByLabel('Name', {exact: true}).fill(draft);
                            await realWrite(() => popup().getByRole('button', {name: 'Save', exact: true}).click());
                        }
                        assert((await readMember()).name === draft, 'Profile recovery did not persist');
                        await profile();
                        entry.reloadPersisted = await popup().getByLabel('Name', {exact: true}).inputValue() === draft;
                        phase = 'restore';
                        await popup().getByLabel('Name', {exact: true}).fill(before.name || '');
                        await realWrite(() => popup().getByRole('button', {name: 'Save', exact: true}).click());
                    } else {
                        // Native newsletter controls autosave and have no Retry
                        // button. Reopen and explicitly reselect the same intention.
                        entry.retryMode = 'reopen and reselect';
                        control = await preferences();
                        await waitChecked(control, !desired);
                        const response = await realWrite(() => clickSwitch(control));
                        assert(response.status() === 200, 'Newsletter recovery was not a real write');
                        assert(Boolean((await readMember()).newsletters?.length) === desired, 'Newsletter recovery did not persist');
                        control = await preferences();
                        await waitChecked(control, desired);
                        entry.reloadPersisted = true;
                        phase = 'restore';
                        await realWrite(() => clickSwitch(control));
                    }
                    entry.restored = stateOf(await readMember()) === beforeState;
                    entry.noMail = mailCount() === initialMail;
                    entry.failedAssertions = [
                        ['failure response/header recorded', failureResponse.status() === status && failureResponse.headers()['retry-after'] === '1'],
                        ['server unchanged during failure', entry.serverUnchanged],
                        ['draft retained', entry.draftRetained],
                        ['client account retained', entry.clientAccountRetained],
                        ['clear failure feedback without success feedback', entry.failureFeedback && !entry.falseSuccess],
                        ['no implicit retry', entry.faultAttempts === 1],
                        ['explicit retry after Retry-After', entry.explicitRetryDelayMs >= 1000],
                        ['real retry persists after reload', entry.reloadPersisted],
                        ['fixture restored', entry.restored],
                        ['no mail sent', entry.noMail],
                    ].filter(([, passed]) => !passed).map(([name]) => name);
                    assert(entry.failedAssertions.length === 0, entry.failedAssertions.join('; '));
                    entry.status = 'passed';
                } finally {
                    await page.unroute(memberURL, fail);
                    page.off('request', requestObserver);
                }
            });
        }
    } finally { fs.writeFileSync(path.join(out, 'account-http.json'), JSON.stringify(evidence, null, 2)); }
}

module.exports = {checkAccountHTTP};
