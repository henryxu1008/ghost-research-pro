const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {createRequire} = require('node:module');
const {execFileSync} = require('node:child_process');
const {buildArchive} = require('../scripts/package.cjs');
// Read back with the independent ZIP reader already installed by pinned GScan.
const gscanRequire = createRequire(require.resolve('gscan/package.json'));
const extract = createRequire(gscanRequire.resolve('@tryghost/zip/package.json'))('extract-zip');
const source = path.resolve(__dirname, '..');
const sha = data => createHash('sha256').update(data).digest('hex');
const fixtureFiles = {
    'index.hbs': '{{!< default}}', 'default.hbs': '{{{body}}}', 'post.hbs': '{{content}}',
    'package.json': '{"name":"fixture"}\n', 'partials/card.hbs': '{{title}}',
    'assets/css/screen.css': 'body{color:#123}\n', 'assets/z-empty.txt': '',
    'assets/数据.bin': Buffer.from([0, 255, 13, 10, 128, 1])
};
function sandbox(t) {
    const parent = fs.realpathSync(os.tmpdir());
    const root = fs.mkdtempSync(path.join(parent, 'ghost-package-'));
    t.after(() => {
        assert.equal(path.dirname(fs.realpathSync(root)), parent, 'Cleanup must stay inside the temporary test directory');
        fs.rmSync(root, {recursive: true, force: true});
    });
    return root;
}
function fixture(root, reverse = false, time = '2001-02-03T04:05:06Z', mode = 0o644) {
    for (const [name, data] of Object.entries(fixtureFiles).sort((a, b) => reverse ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]))) {
        const full = path.join(root, name); fs.mkdirSync(path.dirname(full), {recursive: true});
        fs.writeFileSync(full, data); fs.utimesSync(full, new Date(time), new Date(time)); fs.chmodSync(full, mode);
    }
}
async function unpack(root, archive, label) {
    const file = path.join(root, `${label}.zip`), dir = path.join(root, label), entries = [];
    fs.writeFileSync(file, archive);
    await extract(file, {dir, onEntry: entry => entries.push(entry)});
    return {dir, entries};
}

test('same file bytes give identical ZIP SHA across creation order, mtimes, modes and timezones', t => {
    const root = sandbox(t), first = path.join(root, 'first'), second = path.join(root, 'second');
    fixture(first); fixture(second, true, '2026-10-29T23:59:58Z', 0o755);
    function buildInTZ(directory, TZ) {
        return execFileSync(process.execPath, ['-e', 'process.stdout.write(require(process.argv[1]).buildArchive(process.argv[2]))', path.join(source, 'scripts/package.cjs'), directory], {env: {...process.env, TZ}});
    }
    const a = buildInTZ(first, 'UTC'), b = buildInTZ(second, 'Pacific/Honolulu');
    assert.equal(sha(a), sha(b));
    assert.deepEqual(a, b);
});

test('independent extraction preserves UTF-8 paths/binary/empty files and fixed readable metadata', async t => {
    const root = sandbox(t), src = path.join(root, 'source'); fixture(src);
    const {dir, entries} = await unpack(root, buildArchive(src), 'unpacked');
    assert.deepEqual(entries.map(e => e.fileName), Object.keys(fixtureFiles).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b))));
    for (const entry of entries) {
        assert.deepEqual(fs.readFileSync(path.join(dir, entry.fileName)), Buffer.from(fixtureFiles[entry.fileName]));
        assert.equal(entry.compressionMethod, 0);
        assert.equal(entry.lastModFileDate, 0x21); assert.equal(entry.lastModFileTime, 0);
        assert.equal(entry.versionMadeBy >> 8, 3);
        assert.equal(entry.externalFileAttributes >>> 16, 0o100644);
        assert.deepEqual(entry.extraFields, []); assert.equal(entry.fileCommentLength, 0);
        assert.equal(entry.generalPurposeBitFlag & 0x800, 0x800);
    }
});

test('only allowed payload files affect SHA; removed files never survive a rebuild', async t => {
    const root = sandbox(t), src = path.join(root, 'source'); fixture(src);
    const original = buildArchive(src);
    for (const name of ['README.md', 'docs/demo.md', 'scripts/secret.cjs', 'node_modules/tool/index.js', 'dist/stale.zip', 'assets/debug.js.map']) {
        const full = path.join(src, name); fs.mkdirSync(path.dirname(full), {recursive: true}); fs.writeFileSync(full, 'excluded');
    }
    assert.equal(sha(buildArchive(src)), sha(original), 'Docs/dependencies/maps/build output must not enter the theme');
    fs.appendFileSync(path.join(src, 'post.hbs'), '\nchanged payload');
    assert.notEqual(sha(buildArchive(src)), sha(original), 'Payload edits must change the artifact hash');
    fs.unlinkSync(path.join(src, 'assets/z-empty.txt'));
    const {entries} = await unpack(root, buildArchive(src), 'rebuilt');
    assert.deepEqual(entries.map(e => e.fileName).sort(), Object.keys(fixtureFiles).filter(n => n !== 'assets/z-empty.txt').sort());
});

test('required payload omissions fail instead of producing a misleading theme', t => {
    const root = sandbox(t), src = path.join(root, 'source'); fixture(src);
    fs.unlinkSync(path.join(src, 'post.hbs'));
    assert.throws(() => buildArchive(src), /Missing required theme file: post.hbs/);
});

test('provided root LICENSE and NOTICE are preserved without inventing missing terms', async t => {
    const root = sandbox(t), src = path.join(root, 'source'); fixture(src);
    const original = buildArchive(src);
    const notices = {LICENSE: 'Fixture license text only; not a project grant.\n', NOTICE: 'Fixture attribution notice.\n'};
    for (const [name, text] of Object.entries(notices)) fs.writeFileSync(path.join(src, name), text);
    const included = buildArchive(src);
    assert.notEqual(sha(included), sha(original), 'Existing legal notices must not silently disappear');
    const {dir, entries} = await unpack(root, included, 'with-notices');
    for (const [name, text] of Object.entries(notices)) {
        assert(entries.some(entry => entry.fileName === name));
        assert.equal(fs.readFileSync(path.join(dir, name), 'utf8'), text);
        fs.unlinkSync(path.join(src, name));
    }
    assert.deepEqual(buildArchive(src), original, 'No notice is generated when the owner has not supplied one');
    fs.mkdirSync(path.join(src, 'LICENSE'));
    assert.throws(() => buildArchive(src), /Expected a regular theme file or directory: LICENSE/);
});

test('symlinks cannot import files outside the allowed payload tree', {
    skip: process.platform === 'win32' && 'Windows sandbox denies link fixtures; this negative case must pass on Linux CI'
}, t => {
    const root = sandbox(t), src = path.join(root, 'source'); fixture(src);
    const outside = path.join(root, 'outside'); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'secret.txt'), 'excluded');
    fs.symlinkSync(outside, path.join(src, 'assets/linked'), 'dir');
    assert.throws(() => buildArchive(src), /Symlinks are not theme files/);
});

test('actual theme CLI rebuild is stable and all extracted files match the source byte for byte', async t => {
    const root = sandbox(t), script = path.join(source, 'scripts/package.cjs'), output = path.join(source, 'dist/ghost-research-pro.zip');
    execFileSync(process.execPath, [script]); const first = fs.readFileSync(output);
    fs.appendFileSync(output, 'stale trailing bytes');
    execFileSync(process.execPath, [script]); assert.deepEqual(fs.readFileSync(output), first);
    const {dir, entries} = await unpack(root, first, 'actual');
    for (const entry of entries) {
        assert.match(entry.fileName, /^(?:[^/]+\.hbs$|package\.json$|LICENSE$|NOTICE$|(?:assets|partials)\/)/);
        assert(!entry.fileName.endsWith('.map'));
        assert.deepEqual(fs.readFileSync(path.join(dir, entry.fileName)), fs.readFileSync(path.join(source, entry.fileName)));
    }
});
