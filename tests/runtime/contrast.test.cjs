const assert = require('node:assert/strict');
const test = require('node:test');
const {rgb, composite, luminance, contrast} = require('./contrast.cjs');

test('WCAG reference black/white contrast is 21:1', () => {
    assert.equal(luminance([0, 0, 0]), 0);
    assert.equal(luminance([255, 255, 255]), 1);
    assert.equal(contrast([0, 0, 0], [255, 255, 255]), 21);
});
test('threshold comparisons use the unrounded ratio', () => {
    const ratio = contrast([119, 119, 119], [255, 255, 255]);
    assert(Math.abs(ratio - 4.478089453577214) < 0.000001);
    assert(ratio < 4.5);
});
test('transparent backgrounds and opaque CSS colors composite correctly', () => {
    assert.deepEqual(rgb('rgb(22, 34, 56)'), [22, 34, 56, 1]);
    assert.deepEqual(composite(rgb('rgba(0, 0, 0, 0)'), [255, 255, 255]), [255, 255, 255]);
    assert.deepEqual(composite(rgb('rgba(0, 0, 0, 0.5)'), [255, 255, 255]), [127.5, 127.5, 127.5]);
    assert.throws(() => rgb('color(srgb 1 1 1)'), /Unsupported/);
});
