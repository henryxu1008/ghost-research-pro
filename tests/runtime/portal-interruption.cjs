const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Read-only observations. No form values, URLs, member data or response bodies.
async function observe(page) {
    await page.evaluate(() => {
        const ids = new WeakMap(), seen = new WeakSet(), events = [];
        let sequence = 0;
        const id = frame => {
            if (!ids.has(frame)) ids.set(frame, ++sequence);
            return ids.get(frame);
        };
        const track = () => {
            for (const frame of document.querySelectorAll('iframe[title="portal-popup"]')) {
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
                await action();
                entry.stages.push(await snapshot(page, name));
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
                if (await frameElement().count()) {
                    await step('close-repeated', () => popup().getByRole('button', {name: 'Close popup', exact: true}).click());
                }
                await step('wait-repeated-detached', () => frameElement().waitFor({state: 'detached'}));
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

module.exports = {checkInterruption};
