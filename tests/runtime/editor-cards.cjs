const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe, audit} = require('./accessibility.cjs');

async function seedEditorCards({runtime, base, api, admin}) {
    fs.mkdirSync(path.join(runtime, 'content/images'), {recursive: true});
    fs.mkdirSync(path.join(runtime, 'content/files'), {recursive: true});
    fs.writeFileSync(path.join(runtime, 'content/images/qa-landscape.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#dce8f4"/><path d="M0 500L300 200L650 420L1000 120L1200 300V600H0Z" fill="#174e8b"/></svg>');
    fs.writeFileSync(path.join(runtime, 'content/files/qa-notes.txt'), 'Local editorial QA fixture.');
    fs.writeFileSync(path.join(runtime, 'content/files/qa-chart.html'), '<!doctype html><html lang="en"><title>Local QA chart</title><body><h1>Local chart</h1><p>Sample value: 42</p></body></html>');
    const image = `${base}/content/images/qa-landscape.svg`;
    for (const [slug, marker, visibility] of [
        ['editor-cards', 'CARD_PUBLIC_48c', 'public'],
        ['editor-cards-locked', 'CARD_SECRET_93d', 'paid'],
    ]) {
        const node = (type, fields) => ({type, version: 1, ...fields});
        const children = [
            node('html', {html: `<h2>${marker} Findings</h2><p>Read the <a href="/about/">research methods</a>.</p><blockquote>Clear and reproducible research.</blockquote><ul><li>Source review</li><li>Reproducible analysis</li></ul><table><caption>Research indicators</caption><thead><tr><th scope="col">Indicator</th><th scope="col">Long reference</th></tr></thead><tbody><tr><th scope="row">Sample</th><td>${'reference_'.repeat(45)}</td></tr></tbody></table>`}),
            ...['regular', 'wide', 'full'].map(cardWidth => node('image', {src: image, width: 1200, height: 600,
                alt: `${marker} ${cardWidth} research chart`, caption: `${cardWidth} chart`, cardWidth})),
            node('gallery', {images: [{src: image, fileName: 'first.svg', row: 0, width: 1200, height: 600, alt: `${marker} first gallery chart`},
                {src: image, fileName: 'second.svg', row: 0, width: 1200, height: 600, alt: `${marker} second gallery chart`}], caption: 'Chart comparison'}),
            node('bookmark', {url: `${base}/about/`, metadata: {title: `${marker} Research methodology`,
                description: 'A local reference for the research process.', author: 'QA Researcher', publisher: 'Research QA', thumbnail: image}}),
            node('callout', {calloutText: `<p>${marker} Important research context.</p>`, calloutEmoji: '💡', backgroundColor: 'blue'}),
            node('button', {buttonText: `${marker} Read methods`, buttonUrl: `${base}/about/`, alignment: 'left'}),
            node('toggle', {heading: `${marker} Additional detail`, content: '<p>Supporting methodology.</p>'}),
            node('file', {src: `${base}/content/files/qa-notes.txt`, fileName: 'research-notes.txt', fileSize: 26,
                fileTitle: `${marker} Research notes`, fileCaption: 'Local text download'}),
            node('embed', {url: `${base}/content/files/qa-chart.html`, html: `<iframe src="${base}/content/files/qa-chart.html" title="${marker} Embedded research chart" width="1200" height="240"></iframe>`, caption: 'Local embed'}),
            node('codeblock', {code: `${marker}\n${'long_research_identifier_'.repeat(50)}`, language: 'text'}),
        ];
        const lexical = JSON.stringify({root: {type: 'root', version: 1, children, direction: null, format: '', indent: 0}});
        await api(admin, 'post', 'posts/', {posts: [{title: slug, slug, status: 'published', visibility,
            custom_excerpt: 'Public editorial fixture summary.', lexical}]});
    }
}

async function checkEditorAccess({anon, free, tierA, record}) {
    for (const [label, ctx, allowed] of [['anonymous', anon, false], ['free', free, false], ['tier-a', tierA, true], ['anonymous-after-paid', anon, false]]) {
        await probe(record, `Editor card HTML privacy: ${label}`, async () => {
            const response = await ctx.get('/editor-cards-locked/');
            assert.equal(response.status(), 200);
            assert.equal((await response.text()).includes('CARD_SECRET_93d'), allowed);
        });
    }
}

async function checkEditorCards({browser, base, out, record}) {
    for (const width of [360, 768, 1440]) {
        const page = await browser.newPage({viewport: {width, height: 1000}});
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        await page.goto(`${base}/editor-cards/`, {waitUntil: 'networkidle'});
        await page.locator('.gh-content img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
        await page.evaluate(() => Promise.all([...document.querySelectorAll('.gh-content img')].map(image => image.decode().catch(() => {}))));
        await probe(record, `Editor cards render and fit at ${width}px`, async () => {
            for (const selector of ['.kg-image-card', '.kg-gallery-card', '.kg-bookmark-card', '.kg-callout-card', '.kg-button-card', '.kg-toggle-card', '.kg-file-card', '.kg-embed-card', 'pre', 'table']) {
                assert(await page.locator(`.gh-content ${selector}`).count(), `Missing rendered ${selector}`);
            }
            assert(await page.locator('.gh-content img').evaluateAll(images => images.every(image => image.naturalWidth > 0)), 'An editorial image did not load');
            assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), 'Horizontal page overflow');
            for (const cardWidth of ['wide', 'full']) {
                const bounds = await page.locator(`.kg-image-card.kg-width-${cardWidth}`).evaluate(el => {
                    const rect = el.getBoundingClientRect(); return {left: rect.left, right: rect.right, width: innerWidth};
                });
                assert(bounds.left >= -1 && bounds.right <= bounds.width + 1, `${cardWidth} image exceeds the viewport`);
            }
        });
        await probe(record, `Editor toggle and download keyboard access at ${width}px`, async () => {
            const toggle = page.locator('.kg-toggle-card button');
            await toggle.focus();
            await page.keyboard.press('Enter');
            assert.equal(await page.locator('.kg-toggle-card').getAttribute('data-kg-toggle-state'), 'open');
            await page.keyboard.press('Space');
            assert.equal(await page.locator('.kg-toggle-card').getAttribute('data-kg-toggle-state'), 'close');
            const file = page.locator('.kg-file-card a');
            assert.equal((await page.request.get(new URL(await file.getAttribute('href'), base).href)).status(), 200);
            assert(await file.getAttribute('href'), 'File card lacks a download target');
        });
        if (width !== 768) await audit(page, {out, label: `editor-cards-${width}`, record});
        await page.screenshot({path: path.join(out, `editor-cards-${width}.png`), fullPage: true});
        await page.close();
    }
}

module.exports = {seedEditorCards, checkEditorAccess, checkEditorCards};
