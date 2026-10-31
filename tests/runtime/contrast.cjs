const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {probe} = require('./accessibility.cjs');

function rgb(value) {
    if (!/^rgba?\(/.test(value)) throw new Error(`Unsupported computed color: ${value}`);
    const parts = value.match(/[\d.]+/g).map(Number);
    if (![3, 4].includes(parts.length)) throw new Error('Invalid computed RGB color');
    return [...parts.slice(0, 3), parts[3] ?? 1];
}
function composite(top, bottom) {
    return top.slice(0, 3).map((channel, index) => channel * top[3] + bottom[index] * (1 - top[3]));
}
function luminance(color) {
    const linear = color.map(channel => {
        const srgb = channel / 255;
        return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(foreground, background) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
}
function resolveColors(sample) {
    let background = [255, 255, 255];
    for (const layer of sample.ancestors) {
        assert.equal(Number(layer.opacity), 1, 'Opacity needs a separate manual compositing review');
        assert.equal(layer.backgroundImage, 'none', 'Background image needs manual review');
        assert.equal(layer.filter, 'none', 'Filter needs manual review');
        assert.equal(layer.mixBlendMode, 'normal', 'Blend mode needs manual review');
        background = composite(rgb(layer.backgroundColor), background);
    }
    const foreground = composite(rgb(sample.color), background);
    return {foreground, background, ratio: contrast(foreground, background), threshold: 4.5};
}

async function waitForScrollIdle(region) {
    await region.evaluate(el => new Promise((resolve, reject) => {
        let previous = el.scrollLeft, stable = 0, frames = 0;
        const tick = () => {
            stable = el.scrollLeft === previous ? stable + 1 : 0;
            previous = el.scrollLeft;
            if (stable >= 6) return resolve();
            if (++frames > 180) return reject(new Error('Scroll position did not settle'));
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }));
}

async function reviewContrast(page, {width, out, record}) {
    await probe(record, `Computed scroll-region text contrast at ${width}px`, async () => {
        const evidence = {width, standard: 'WCAG 2.2 SC 1.4.3',
            method: 'Computed styles plus WCAG sRGB luminance; independent of axe incomplete status. Screenshots require visual review.',
            samples: [], scrollStates: []};
        const selectors = ['.gh-content table caption', '.gh-content table th', '.gh-content table td', '.gh-content pre code', '.gh-content > p', '.gh-content figcaption'];
        const samples = await page.evaluate(selectors => selectors.flatMap(selector => [...document.querySelectorAll(selector)].map((el, index) => {
            const style = getComputedStyle(el);
            const ancestors = [];
            for (let current = el; current; current = current.parentElement) {
                const css = getComputedStyle(current);
                ancestors.unshift({tag: current.tagName, className: current.className, backgroundColor: css.backgroundColor,
                    backgroundImage: css.backgroundImage, opacity: css.opacity, filter: css.filter, mixBlendMode: css.mixBlendMode});
            }
            return {selector, index, tag: el.tagName, className: el.className, role: el.getAttribute('role'),
                scope: el.getAttribute('scope'), color: style.color, fontSize: style.fontSize, fontWeight: style.fontWeight, ancestors};
        })), selectors);
        try {
            evidence.samples = samples.map(sample => ({...sample, ...resolveColors(sample)}));
            for (const tag of ['table', 'pre']) {
                const region = page.locator(`.gh-content ${tag}`);
                await waitForScrollIdle(region);
                const max = await region.evaluate(el => el.scrollWidth - el.clientWidth);
                for (const [state, left] of [['start', 0], ['middle', Math.floor(max / 2)], ['end', max]]) {
                    await region.evaluate((el, left) => { el.scrollLeft = left; }, left);
                    await waitForScrollIdle(region);
                    const filename = `contrast-${tag}-${width}-${state}.png`;
                    const dimensions = await region.evaluate(el => ({left: el.scrollLeft, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth}));
                    await region.screenshot({path: path.join(out, filename), animations: 'disabled'});
                    evidence.scrollStates.push({tag, state, filename, ...dimensions});
                }
                await region.evaluate(el => { el.scrollLeft = 0; });
                await waitForScrollIdle(region);
            }
        } finally {
            const filename = path.join(out, 'contrast-review.json');
            const reviews = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, 'utf8')) : [];
            reviews.push(evidence);
            fs.writeFileSync(filename, JSON.stringify(reviews, null, 2));
        }
        assert(evidence.samples.length >= 5, 'Missing contrast targets');
        for (const sample of evidence.samples) assert(sample.ratio >= sample.threshold, `${sample.selector}: ${sample.ratio} < ${sample.threshold}`);
    });
}

module.exports = {rgb, composite, luminance, contrast, resolveColors, waitForScrollIdle, reviewContrast};
