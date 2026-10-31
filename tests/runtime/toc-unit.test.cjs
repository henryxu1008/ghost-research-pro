// Algorithm checks with a deliberately small DOM double, not browser/layout QA.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../../assets/js/accessibility.js'), 'utf8');
function run(specs, reserved = []) {
    const all = [];
    function element(tag, properties = {}) {
        const node = {tagName: tag.toUpperCase(), children: [], id: '', innerText: '', visibility: 'visible',
            append(child) { this.children.push(child); },
            querySelector(selector) { return this.children.find(child => child.tagName === selector.toUpperCase()) || null; },
            hasAttribute(name) { return name === 'tabindex' && this.tabIndex !== undefined; },
            closest() { return this.excluded ? {} : null; },
            getClientRects() { return this.noRects ? [] : [{}]; },
            checkVisibility() { return !this.transparent; }, ...properties};
        all.push(node); return node;
    }
    reserved.forEach(id => element('span', {id}));
    const headings = specs.map(spec => element(spec.tag || 'h2', spec));
    const list = element('ol');
    const toc = element('nav', {hidden: true});
    toc.append(list);
    toc.parentElement = {querySelector: () => ({querySelectorAll: () => headings})};
    const document = {
        querySelectorAll: selector => selector === '.report > .report-toc' ? [toc] : [],
        getElementById: id => all.find(el => el.id === id), createElement: element,
        querySelector: () => null, addEventListener() {}, body: {},
    };
    vm.runInNewContext(source, {document, getComputedStyle: node => ({visibility: node.visibility}), MutationObserver: class { observe() {} }});
    const links = all.filter(el => el.tagName === 'A');
    return {headings, toc, list, links};
}
test('Unicode slugs avoid document collisions, preserve IDs and nest subsections', () => {
    const {headings, list, links, toc} = run([
        {innerText: '研究'}, {tag: 'h3', innerText: '数据'}, {innerText: '研究'},
        {innerText: '!!!'}, {innerText: 'Saved heading', id: 'saved:章节', tabIndex: 0},
    ], ['report-研究']);
    assert.deepEqual(headings.map(el => el.id), ['report-研究-2', 'report-数据', 'report-研究-3', 'report-section', 'saved:章节']);
    assert.equal(list.children.length, 4);
    assert.equal(list.children[0].querySelector('ol').children.length, 1);
    assert.equal(headings[0].tabIndex, -1);
    assert.equal(headings.at(-1).tabIndex, 0);
    assert.equal(links.at(-1).href, '#saved%3A%E7%AB%A0%E8%8A%82');
    assert.equal(toc.hidden, false);
});
test('excluded, unrendered, invisible, transparent and empty headings create no TOC', () => {
    const {links, toc} = run([{innerText: 'Secret', excluded: true}, {innerText: 'Hidden', noRects: true}, {innerText: 'Hidden', visibility: 'hidden'}, {innerText: 'Transparent', transparent: true}, {innerText: '  '}]);
    assert.equal(links.length, 0);
    assert.equal(toc.hidden, true);
});
test('authored duplicate IDs remain unchanged and later duplicates are not linked', () => {
    const {headings, links} = run([{innerText: 'First', id: 'same'}, {innerText: 'Second', id: 'same'}]);
    assert.deepEqual(headings.map(el => el.id), ['same', 'same']);
    assert.deepEqual(links.map(el => el.textContent), ['First']);
});
test('a leading H3 is a top-level link; labels are assigned as plain text', () => {
    const {list, links} = run([{tag: 'h3', innerText: '<img src=x>'}]);
    assert.equal(list.children.length, 1);
    assert.equal(links[0].textContent, '<img src=x>');
    assert.equal(links[0].children.length, 0);
});
