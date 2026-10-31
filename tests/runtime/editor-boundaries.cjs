const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

async function seedEditorBoundaries({base, api, admin}) {
    const node = (type, fields) => ({type, version: 1, ...fields});
    const image = `${base}/content/images/qa-landscape.svg`;
    const children = [
        node('button', {buttonText: 'BUTTON_BOUNDARY_'.repeat(12), buttonUrl: `${base}/about/`, alignment: 'center'}),
        node('file', {src: `${base}/content/files/qa-notes.txt`, fileName: `${'research_notes_'.repeat(12)}.txt`, fileSize: 26,
            fileTitle: 'FILE_BOUNDARY_'.repeat(12), fileCaption: 'Local fixture download'}),
        node('bookmark', {url: `${base}/about/`, metadata: {title: 'BOOKMARK_BOUNDARY_'.repeat(12),
            description: 'REFERENCE_'.repeat(30), author: 'QA Researcher', publisher: 'Research QA', thumbnail: image}}),
        node('callout', {calloutText: `<p>${'CALLOUT_BOUNDARY_'.repeat(15)}</p>`, calloutEmoji: '📎', backgroundColor: 'blue'}),
        node('gallery', {images: [0, 1, 2].map(index => ({src: image, fileName: `${index}.svg`, row: 0,
            width: 1200, height: 600, alt: `Boundary chart ${index + 1}`})), caption: 'GALLERY_CAPTION_'.repeat(15)}),
    ];
    const lexical = JSON.stringify({root: {type: 'root', version: 1, children, direction: null, format: '', indent: 0}});
    await api(admin, 'post', 'posts/', {posts: [{title: 'Editor card boundaries', slug: 'editor-boundaries',
        status: 'published', visibility: 'public', custom_excerpt: 'Boundary QA public summary.', lexical}]});
}

async function checkEditorBoundaries({browser, base, out, record}) {
    const evidence = [];
    try {
        for (const width of [320, 800, 801]) {
            const page = await browser.newPage({viewport: {width, height: 1000}});
            await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
            try {
                await page.goto(`${base}/editor-boundaries/`, {waitUntil: 'networkidle'});
                await page.locator('.gh-content img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
                await page.evaluate(() => Promise.all([...document.querySelectorAll('.gh-content img')].map(image => image.decode())));
                await probe(record, `Long editor card text and three-image gallery fit at ${width}px`, async () => {
                    const state = await page.evaluate(() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
                        buttons: [...document.querySelectorAll('.kg-button-card a')].map(el => ({
                            clientHeight: el.clientHeight, scrollHeight: el.scrollHeight,
                            height: getComputedStyle(el).height, overflowY: getComputedStyle(el).overflowY,
                            lineHeight: getComputedStyle(el).lineHeight,
                        })),
                        elements: [...document.querySelectorAll('.gh-content .kg-card,.gh-content a')].map(el => {
                            const rect = el.getBoundingClientRect();
                            return {tag: el.tagName, className: el.className, left: rect.left, right: rect.right};
                        })}));
                    evidence.push(state);
                    assert(state.scrollWidth <= width + 1, 'Long card text causes horizontal page overflow');
                    assert(state.elements.every(el => el.left >= -1 && el.right <= width + 1), 'An editor card or action exceeds the viewport');
                    assert(state.buttons.every(button => button.scrollHeight <= button.clientHeight + 1), 'Long CTA text is vertically clipped');
                    assert(await page.locator('.kg-gallery-card img').count() === 3, 'Three-image gallery did not render');
                    assert(await page.locator('.kg-gallery-card img').evaluateAll(images => images.every(image => image.naturalWidth > 0)), 'Gallery image failed to load');
                });
                await page.screenshot({path: path.join(out, `editor-boundaries-${width}.png`), fullPage: true});
                await probe(record, `Boundary file download and CTA work with the keyboard at ${width}px`, async () => {
                    const file = page.locator('.kg-file-card a');
                    await file.focus();
                    const [download] = await Promise.all([page.waitForEvent('download'), file.press('Enter')]);
                    assert(await download.failure() === null, 'File card download failed');
                    assert(fs.readFileSync(await download.path(), 'utf8') === 'Local editorial QA fixture.', 'File download body differs from the fixture');
                    const button = page.locator('.kg-button-card a');
                    await button.focus();
                    await Promise.all([page.waitForURL(`${base}/about/`), button.press('Enter')]);
                    assert(await page.locator('main').count() === 1, 'CTA destination did not render');
                });
            } finally { await page.close(); }
        }
    } finally { fs.writeFileSync(path.join(out, 'editor-boundaries.json'), JSON.stringify(evidence, null, 2)); }
}

module.exports = {seedEditorBoundaries, checkEditorBoundaries};
