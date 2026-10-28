const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

async function probe(record, name, action) {
    try { await action(); record(name); }
    catch (error) { record(name, error.message); }
}

async function audit(document, {out, label, record}) {
    await probe(record, `Axe WCAG A/AA: ${label}`, async () => {
        await document.evaluate(async () => {
            await window.document.fonts.ready;
            await Promise.all(window.document.getAnimations()
                .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
                .map(animation => animation.finished.catch(() => {})));
        });
        await document.addScriptTag({path: require.resolve('axe-core/axe.min.js')});
        const result = await document.evaluate(async () => {
            const report = await axe.run(window.document, {
                runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']},
                iframes: false,
            });
            // No raw HTML, content, form values or authentication state in evidence.
            const summarize = rule => ({id: rule.id, impact: rule.impact, help: rule.help,
                helpUrl: rule.helpUrl, targets: rule.nodes.map(node => node.target)});
            return {version: axe.version, violations: report.violations.map(summarize),
                incomplete: report.incomplete.map(summarize), passes: report.passes.length};
        });
        const filename = path.join(out, 'accessibility.json');
        const reports = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : [];
        reports.push({label, ...result});
        fs.writeFileSync(filename, JSON.stringify(reports, null, 2));
        assert.equal(result.violations.length, 0, `${label}: ${result.violations.map(rule => rule.id).join(', ')}`);
    });
}

async function checkCoreKeyboard(page, {base, record}) {
    await probe(record, 'Keyboard skip link focuses main content', async () => {
        await page.goto(base);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
        await page.keyboard.press('Tab');
        assert(await page.locator('main').evaluate(el => el.contains(document.activeElement)), 'Tab after skip returned to header');
    });
}

module.exports = {probe, audit, checkCoreKeyboard};
