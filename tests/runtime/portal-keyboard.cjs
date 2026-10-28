const assert = require('node:assert/strict');
const {probe, audit} = require('./accessibility.cjs');
const {checkInterruption} = require('./portal-interruption.cjs');

module.exports.checkPortalKeyboard = async function checkPortalKeyboard({page, ctx, base, out, record, mailCount}) {
    await ctx.request.delete(`${base}/members/api/session/`);
    const popup = () => page.frameLocator('iframe[title="portal-popup"]');
    const trigger = () => page.locator('.member-actions a[href="#/portal/signin"]');
    const frameElement = () => page.locator('iframe[title="portal-popup"]');
    const open = async () => {
        await page.goto(base, {waitUntil: 'networkidle'});
        await trigger().focus();
        await trigger().press('Enter');
        await popup().getByLabel('Email', {exact: true}).waitFor({state: 'visible'});
    };
    for (const width of [360, 1440]) {
        await page.setViewportSize({width, height: 1000});
        await open();
        const frame = await (await frameElement().elementHandle()).contentFrame();
        await audit(frame, {out, label: `portal-signin-${width}`, record});
        await probe(record, `Portal Escape closes and restores trigger focus at ${width}px`, async () => {
            await open();
            await popup().getByLabel('Email', {exact: true}).press('Escape');
            await frameElement().waitFor({state: 'detached', timeout: 3000});
            assert(await trigger().evaluate(el => el === document.activeElement), 'Focus did not return to the Sign in trigger');
        });
        await probe(record, `Portal close button returns keyboard focus at ${width}px`, async () => {
            await open();
            await popup().getByRole('button', {name: 'Close popup', exact: true}).focus();
            await page.keyboard.press('Enter');
            await frameElement().waitFor({state: 'detached', timeout: 3000});
            assert(await trigger().evaluate(el => el === document.activeElement), 'Close button did not restore the trigger');
        });
        await probe(record, `Portal Tab and Shift+Tab remain inside the open dialog at ${width}px`, async () => {
            await open();
            await popup().getByLabel('Email', {exact: true}).focus();
            for (const key of ['Tab', 'Shift+Tab']) {
                for (let i = 0; i < 12; i++) {
                    await page.keyboard.press(key);
                    assert(await frameElement().evaluate(el => document.activeElement === el), `${key} escaped the Portal iframe`);
                }
            }
        });
        await probe(record, `Portal form switching and reopening preserve a single usable dialog at ${width}px`, async () => {
            const repeats = width === 1440 ? Number(process.env.PORTAL_INTERRUPTION_REPEATS || 1) : 1;
            await checkInterruption({page, popup, trigger, frameElement, open, out, width, repeats, mailCount});
        });
    }
};
