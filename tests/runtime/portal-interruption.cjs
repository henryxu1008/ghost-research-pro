const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

async function closeRepeatedDialog({popup, frameElement, step}) {
    // Portal opens asynchronously after the trigger's click handler returns.
    // A zero from count() here is not evidence that the repeated flow is closed.
    await step('wait-repeated-open', () => popup().getByLabel('Email', {exact: true}).waitFor({state: 'visible'}));
    assert.equal(await frameElement().count(), 1, 'Repeated trigger must open exactly one dialog');
    await step('close-repeated', () => popup().getByRole('button', {name: 'Close popup', exact: true}).click());
    await step('wait-repeated-detached', () => frameElement().waitFor({state: 'detached'}));
}

// Read-only observations. No form values, URLs, member data or response bodies.
async function observe(page) {
    await page.evaluate(() => {
        const ids = new WeakMap(), seen = new WeakSet(), events = [];
        let sequence = 0;
        let live = new Set();
        const id = frame => {
            if (!ids.has(frame)) ids.set(frame, ++sequence);
            return ids.get(frame);
        };
        const track = () => {
            const current = new Set(document.querySelectorAll('iframe[title="portal-popup"]'));
            for (const frame of live) {
                if (!current.has(frame) && events.length < 100) events.push({frame: id(frame), type: 'removed'});
            }
            for (const frame of current) {
                if (!live.has(frame) && events.length < 100) events.push({frame: id(frame), type: 'added'});
                id(frame);
                const doc = frame.contentDocument;
                if (!doc || seen.has(doc)) continue;
                seen.add(doc);
                for (const capture of [true, false]) doc.addEventListener('click', event => {
                    if (events.length < 100) events.push({frame: id(frame), type: 'click', capture,
                        close: Boolean(event.target.closest?.('[data-test-button="close-popup"]')),
                        tag: event.target.tagName, defaultPrevented: event.defaultPrevented});
                }, capture);
                frame.addEventListener('load', track);
            }
            live = current;
        };
        new MutationObserver(track).observe(document.body, {childList: true, subtree: true});
        track();
        window.__portalInterruption = {ids, events};
    });
}

async function snapshot(page, stage) {
    return page.evaluate(stage => {
        const evidence = window.__portalInterruption;
        return {stage, focus: document.activeElement.tagName,
            mainInert: document.querySelector('main')?.inert,
            frames: [...document.querySelectorAll('iframe[title="portal-popup"]')].map(frame => {
                const doc = frame.contentDocument;
                const close = doc?.querySelector('[data-test-button="close-popup"]');
                const rect = close?.getBoundingClientRect();
                return {id: evidence?.ids.get(frame), ready: doc?.readyState,
                    panel: doc?.querySelector('.gh-portal-popup-container')?.className,
                    close: Boolean(close), closeBounds: rect && {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
                    animations: doc?.getAnimations().map(animation => animation.playState),
                    adapter: Boolean(doc?.querySelector('#theme-portal-accessibility'))};
            }), events: evidence?.events || []};
    }, stage);
}

async function checkInterruption({page, popup, trigger, frameElement, open, out, width, repeats, mailCount}) {
    assert(Number.isInteger(repeats) && repeats >= 1 && repeats <= 30, 'Portal interruption repeats must be 1..30');
    const filename = path.join(out, 'portal-interruption.json');
    const evidence = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : [];
    try {
        for (let iteration = 1; iteration <= repeats; iteration++) {
            const entry = {width, iteration, stages: []};
            evidence.push(entry);
            let stage = 'open';
            const step = async (name, action) => {
                stage = name;
                const state = {stage: name, completed: false};
                entry.stages.push(state);
                await action();
                state.completed = true;
            };
            try {
                const before = mailCount();
                await open();
                await observe(page);
                entry.stages.push(await snapshot(page, 'opened'));
                await step('select-signup', () => popup().getByRole('button', {name: 'Sign up', exact: true}).click());
                await step('fill-draft', () => popup().getByLabel('Email', {exact: true}).fill('unsent-draft@example.test'));
                await step('switch-signin', async () => {
                    await popup().getByRole('button', {name: 'Sign in', exact: true}).click();
                    await popup().getByRole('button', {name: 'Continue', exact: true}).waitFor({state: 'visible'});
                });
                await step('close-switched', () => popup().getByRole('button', {name: 'Close popup', exact: true}).click());
                await step('wait-switched-detached', () => frameElement().waitFor({state: 'detached'}));
                await step('repeat-trigger', () => trigger().dblclick());
                assert(await frameElement().count() <= 1, 'Repeated trigger opened duplicate dialogs');
                await closeRepeatedDialog({popup, frameElement, step});
                // Read evidence only after the close assertions finish; avoid adding
                // browser round trips/delays between the interactions under test.
                entry.closed = await snapshot(page, 'closed');
                await step('reopen', open);
                stage = 'verify-reopen';
                assert.equal(await frameElement().count(), 1);
                assert.equal(await popup().getByLabel('Email', {exact: true}).inputValue(), '');
                assert.equal(mailCount(), before, 'Interrupted form flow sent an email');
                entry.status = 'passed';
            } catch (error) {
                entry.status = 'failed';
                entry.failedStage = stage;
                entry.stages.push(await snapshot(page, 'failure'));
                await page.screenshot({path: path.join(out, `portal-interruption-failure-${width}-${iteration}.png`), fullPage: true});
                throw new Error(`Portal interruption ${width}px iteration ${iteration}/${repeats}, stage ${stage}: ${error.message}`);
            }
        }
    } finally {
        fs.writeFileSync(filename, JSON.stringify(evidence, null, 2));
    }
}

async function checkDelayedPortalOpen({browser, out, record}) {
    const page = await browser.newPage();
    await page.route('**/*', route => route.abort());
    try {
        await probe(record, 'Portal repeated-trigger wait handles a delayed iframe', async () => {
            await page.setContent('<!doctype html><html><body><a id="trigger" href="#/portal/signin">Sign in</a></body></html>');
            await page.evaluate(() => {
                window.closeClicks = 0;
                document.querySelector('#trigger').addEventListener('click', event => {
                    event.preventDefault();
                    // Hold creation until the initial zero-frame state was checked.
                    window.releasePortal = () => {
                        const frame = document.createElement('iframe');
                        frame.title = 'portal-popup';
                        frame.srcdoc = '<!doctype html><html><body><label>Email<input type="email"></label><button aria-label="Close popup" onclick="parent.closeClicks++;frameElement.remove()">Close</button></body></html>';
                        document.body.append(frame);
                    };
                });
            });
            const frameElement = () => page.locator('iframe[title="portal-popup"]');
            const popup = () => page.frameLocator('iframe[title="portal-popup"]');
            await page.locator('#trigger').dblclick();
            assert.equal(await frameElement().count(), 0, 'Fixture must start before asynchronous creation');
            await Promise.all([
                closeRepeatedDialog({popup, frameElement, step: async (name, action) => action()}),
                page.evaluate(() => window.releasePortal()),
            ]);
            assert.equal(await frameElement().count(), 0);
            assert.equal(await page.evaluate(() => window.closeClicks), 1, 'Late dialog never received its close click');
            fs.writeFileSync(path.join(out, 'portal-delayed-open.json'), JSON.stringify({initialFrames: 0, closeClicks: 1, finalFrames: 0}));
        });
    } finally { await page.close(); }
}

module.exports = {checkInterruption, checkDelayedPortalOpen};
