const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

async function checkAdapterBoundaries({browser, out, record}) {
    const evidence = [];
    const selector = 'iframe[title="portal-popup"]';
    for (const scenario of ['inaccessible-initial', 'removed', 'inaccessible-after-open', 'getter-throws-after-open']) {
        const page = await browser.newPage();
        const states = [];
        await page.route('**/*', route => route.abort());
        const snapshot = async stage => {
            states.push({stage, ...await page.evaluate(() => ({mainInert: document.querySelector('main').inert,
                triggerInert: document.querySelector('#trigger').inert, preservedInert: document.querySelector('#preserved').inert,
                focus: document.activeElement.id || document.activeElement.tagName}))});
        };
        await probe(record, `Portal adapter cleanup: ${scenario}`, async () => {
            await page.setContent('<!doctype html><html lang="en"><title>Adapter fixture</title><body><a id="trigger" href="#/portal/signin">Sign in</a><main><a href="#content">Content</a></main><aside id="preserved" inert>Previously inert</aside><div id="ghost-portal-root"></div></body></html>');
            await page.addScriptTag({path: path.resolve(__dirname, '../../assets/js/accessibility.js')});
            await page.evaluate(inaccessible => {
                const trigger = document.querySelector('#trigger');
                trigger.addEventListener('click', event => {
                    event.preventDefault();
                    const frame = document.createElement('iframe');
                    frame.title = 'portal-popup';
                    if (inaccessible) frame.setAttribute('sandbox', 'allow-scripts');
                    frame.srcdoc = '<!doctype html><html><body><div class="gh-portal-popup-container"><h1>Fixture ready</h1><button data-test-button="close-popup" aria-label="Close popup">Close</button></div></body></html>';
                    document.querySelector('#ghost-portal-root').append(frame);
                });
            }, scenario === 'inaccessible-initial');
            await page.locator('#trigger').click();
            await page.frameLocator(selector).getByRole('heading', {name: 'Fixture ready'}).waitFor();
            if (scenario !== 'inaccessible-initial') {
                await page.waitForFunction(() => document.querySelector('main').inert);
                await page.frameLocator(selector).getByRole('button', {name: 'Close popup'}).focus();
            }
            await snapshot('opened');
            if (scenario === 'removed') {
                await page.locator(selector).evaluate(frame => frame.remove());
            } else if (scenario === 'inaccessible-after-open') {
                await page.locator(selector).evaluate(frame => {
                    frame.setAttribute('sandbox', 'allow-scripts');
                    frame.srcdoc = '<!doctype html><html><body><h1>Blocked document ready</h1></body></html>';
                });
                await page.frameLocator(selector).getByRole('heading', {name: 'Blocked document ready'}).waitFor();
            } else if (scenario === 'getter-throws-after-open') {
                await page.locator(selector).evaluate(frame => {
                    Object.defineProperty(frame, 'contentDocument', {get() { throw new DOMException('Fixture inaccessible document', 'SecurityError'); }});
                    frame.dispatchEvent(new Event('load'));
                });
            }
            await snapshot('after-boundary');
            await page.waitForFunction(() => !document.querySelector('main').inert && !document.querySelector('#trigger').inert, null, {timeout: 2000});
            await page.waitForFunction(() => document.activeElement.id === 'trigger', null, {timeout: 2000});
            assert(await page.locator('#preserved').evaluate(el => el.inert), 'Preexisting inert state was lost');
            await snapshot('cleaned');
        });
        evidence.push({scenario, states});
        await page.close();
    }
    fs.mkdirSync(out, {recursive: true});
    fs.writeFileSync(path.join(out, 'adapter-boundary.json'), JSON.stringify(evidence, null, 2));
}

if (require.main === module) {
    const {chromium} = require('playwright');
    (async () => {
        const browser = await chromium.launch({headless: true, ...(process.env.ADAPTER_TEST_CHANNEL ? {channel: process.env.ADAPTER_TEST_CHANNEL} : {})});
        const checks = [];
        try {
            await checkAdapterBoundaries({browser, out: path.resolve(process.env.ADAPTER_TEST_OUT || 'artifacts/adapter-local'),
                record(name, error) { checks.push({name, error}); console.log(`${error ? 'FAIL' : 'PASS'} ${name}${error ? ': ' + error : ''}`); }});
        } finally { await browser.close(); }
        if (checks.some(check => check.error)) process.exitCode = 1;
    })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = {checkAdapterBoundaries};
