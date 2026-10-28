const assert = require('node:assert/strict');
const {probe, audit} = require('./accessibility.cjs');

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
            const before = mailCount();
            await open();
            await popup().getByRole('button', {name: 'Sign up', exact: true}).click();
            await popup().getByLabel('Email', {exact: true}).fill('unsent-draft@example.test');
            await popup().getByRole('button', {name: 'Sign in', exact: true}).click();
            await popup().getByRole('button', {name: 'Continue', exact: true}).waitFor({state: 'visible'});
            await popup().getByRole('button', {name: 'Close popup', exact: true}).click();
            await frameElement().waitFor({state: 'detached'});
            await trigger().dblclick();
            assert(await frameElement().count() <= 1, 'Repeated trigger opened duplicate dialogs');
            if (await frameElement().count()) await popup().getByRole('button', {name: 'Close popup', exact: true}).click();
            await frameElement().waitFor({state: 'detached'});
            await open();
            assert.equal(await frameElement().count(), 1);
            assert.equal(await popup().getByLabel('Email', {exact: true}).inputValue(), '');
            assert.equal(mailCount(), before, 'Interrupted form flow sent an email');
        });
    }
};
