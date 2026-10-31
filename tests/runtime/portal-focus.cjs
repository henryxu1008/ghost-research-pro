const assert = require('node:assert/strict');
const {resolveColors} = require('./contrast.cjs');

async function checkPlaceholderContrast(frameElement) {
    // Sample the displayed form after Portal's finite entrance animation, rather
    // than treating a transient fade as its resting text/background contrast.
    await frameElement.evaluate(async frame => {
        const doc = frame.contentDocument;
        await Promise.all(doc.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity)
            .map(animation => animation.finished.catch(() => {})));
    });
    const samples = await frameElement.evaluate(frame => [...frame.contentDocument.querySelectorAll('.gh-portal-input[placeholder]')]
        .filter(el => el.placeholder && el.getClientRects().length)
        .map(el => {
            const style = getComputedStyle(el, '::placeholder');
            const ancestors = [];
            for (let current = el; current; current = current.parentElement) {
                const css = getComputedStyle(current);
                ancestors.unshift({backgroundColor: css.backgroundColor, backgroundImage: css.backgroundImage,
                    opacity: css.opacity, filter: css.filter, mixBlendMode: css.mixBlendMode});
            }
            ancestors.push({backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'none', opacity: style.opacity,
                filter: style.filter, mixBlendMode: style.mixBlendMode});
            return {name: el.name, color: style.color, fontSize: style.fontSize, ancestors};
        }));
    assert(samples.length > 0, 'Expected visible stock Portal placeholders');
    for (const sample of samples) {
        const colors = resolveColors(sample);
        assert(colors.ratio >= 4.5, `${sample.name} placeholder ${sample.color} contrast ${colors.ratio.toFixed(2)} < 4.5`);
    }
    assert.equal(await frameElement.evaluate(frame => frame.contentDocument.querySelectorAll('#theme-portal-accessibility').length), 1,
        'Reopening must install exactly one adapter style in the current document');
    return samples.map(sample => ({name: sample.name, color: sample.color, fontSize: sample.fontSize, ratio: resolveColors(sample).ratio}));
}

// Used with both stock Portal/browser fixtures and disposable real Ghost.
// Never fills or submits a form, creates a session, or sends mail.
async function checkAnonymousFocus({page, trigger, firstLabel, open}) {
    const contrastSamples = [];
    const frameElement = () => page.locator('iframe[title="portal-popup"]');
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    const first = () => popup().getByLabel(firstLabel, {exact: true});
    const focused = async () => {
        assert(await frameElement().evaluate(el => document.activeElement === el), 'Tab escaped the Portal iframe');
        return frameElement().evaluate(frame => {
            const doc = frame.contentDocument, el = doc.activeElement;
            return {index: [...doc.querySelectorAll('*')].indexOf(el), tag: el.tagName, name: el.getAttribute('name'), visible: el.getClientRects().length > 0};
        });
    };
    for (let repeat = 0; repeat < 2; repeat++) {
        await open();
        await first().waitFor({state: 'visible'});
        assert.equal(await frameElement().count(), 1, 'Reopening must create exactly one Portal dialog');
        // Observe native autofocus; do not repair it from the test.
        const frame = await (await first().elementHandle()).ownerFrame();
        await frame.waitForFunction(name => document.activeElement?.getAttribute('name') === name,
            firstLabel === 'Name' ? 'name' : 'email', {timeout: 5000});
        contrastSamples.push({repeat, samples: await checkPlaceholderContrast(frameElement())});
        assert.equal(await page.locator('#theme-portal-accessibility').count(), 0, 'Iframe styles must not leak to the parent document');
        const count = await frameElement().evaluate(frame => [...frame.contentDocument.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
            .filter(el => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden').length);
        assert(count >= 3, 'Expected the actual form and close controls');
        await page.keyboard.press('Shift+Tab');
        assert((await focused()).visible, 'Reverse boundary has no visible focus target');
        await page.keyboard.press('Tab');
        assert(await first().evaluate(el => el === el.ownerDocument.activeElement), 'Forward boundary must return to the initial field');
        for (const key of ['Tab', 'Shift+Tab']) {
            const visited = [];
            for (let step = 0; step < count; step++) {
                await page.keyboard.press(key);
                const target = await focused();
                assert(target.visible && target.tag !== 'BODY', `${key} lost the visible control`);
                visited.push(target.index);
                if (firstLabel === 'Name' && key === 'Tab' && step === 0) assert.equal(target.name, 'email', 'Name must tab to Email');
            }
            assert.equal(new Set(visited).size, count, `${key} skips or repeats a form control`);
            assert(await first().evaluate(el => el === el.ownerDocument.activeElement), `${key} must complete a full cycle`);
        }
        // The reported failure was Escape immediately after reverse-boundary Tab.
        await page.keyboard.press('Shift+Tab');
        await focused();
        await page.keyboard.press('Escape');
        await frameElement().waitFor({state: 'detached'});
        assert(await trigger().evaluate(el => el === document.activeElement), 'Escape did not restore the original trigger');
        assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    }
    await open();
    await first().waitFor({state: 'visible'});
    await popup().getByRole('button', {name: 'Close popup', exact: true}).focus();
    await page.keyboard.press('Enter');
    await frameElement().waitFor({state: 'detached'});
    assert(await trigger().evaluate(el => el === document.activeElement), 'Close button did not restore the trigger');
    assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    return contrastSamples;
}

module.exports = {checkAnonymousFocus};
