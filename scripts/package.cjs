const fs = require('node:fs');
const path = require('node:path');
const {crc32} = require('node:zlib');
const {createHash} = require('node:crypto');

function buildArchive(root) {
    for (const required of ['index.hbs', 'default.hbs', 'post.hbs', 'partials/card.hbs', 'assets/css/screen.css']) {
        if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing required theme file: ${required}`);
    }
    const files = [];
    function visit(name, directoryAllowed = true) {
        if (name.includes('\\') || name.includes(':')) throw new Error(`Unsafe archive path: ${name}`);
        const full = path.join(root, name);
        const stat = fs.lstatSync(full);
        if (stat.isSymbolicLink()) throw new Error(`Symlinks are not theme files: ${name}`);
        if (stat.isDirectory() && directoryAllowed) {
            for (const child of fs.readdirSync(full)) visit(`${name}/${child}`);
        } else if (stat.isFile()) {
            if (!name.endsWith('.map')) files.push(name);
        } else {
            throw new Error(`Expected a regular theme file or directory: ${name}`);
        }
    }
    for (const template of fs.readdirSync(root).filter(name => name.endsWith('.hbs'))) visit(template, false);
    visit('package.json', false);
    for (const notice of ['LICENSE', 'NOTICE']) {
        if (fs.lstatSync(path.join(root, notice), {throwIfNoEntry: false})) visit(notice, false);
    }
    for (const directory of ['assets', 'partials']) visit(directory);
    files.sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
    if (files.length >= 0xffff) throw new Error('Theme exceeds ZIP32 entry limit');

    // ZIP32 stored entries: no compressor-version differences, timestamps from
    // the checkout, directory entries, extra fields, UID/GID or archive comments.
    // Record layout: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
    const localParts = [], centralParts = [];
    let offset = 0;
    for (const file of files) {
        const name = Buffer.from(file, 'utf8'), data = fs.readFileSync(path.join(root, file));
        if (name.length > 0xffff || data.length >= 0xffffffff) throw new Error(`Theme exceeds ZIP32 limits: ${file}`);
        const checksum = crc32(data);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4); // ZIP 2.0 reader
        local.writeUInt16LE(0x800, 6); // UTF-8 filenames
        // Compression method 0 (stored), time 00:00:00 and no extra fields.
        local.writeUInt16LE(0x21, 12); // DOS date 1980-01-01, independent of TZ
        local.writeUInt32LE(checksum, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE((3 << 8) | 20, 4); // Unix creator, on every host
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x800, 8);
        central.writeUInt16LE(0x21, 14);
        central.writeUInt32LE(checksum, 16);
        central.writeUInt32LE(data.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(name.length, 28);
        central.writeUInt32LE((0o100644 << 16) >>> 0, 38); // regular, readable files
        central.writeUInt32LE(offset, 42);
        localParts.push(local, name, data);
        centralParts.push(central, name);
        offset += local.length + name.length + data.length;
        if (offset >= 0xffffffff) throw new Error('Theme exceeds ZIP32 archive limit');
    }
    const centralSize = centralParts.reduce((size, part) => size + part.length, 0);
    if (offset + centralSize + 22 >= 0xffffffff) throw new Error('Theme exceeds ZIP32 archive limit');
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(files.length, 8);
    end.writeUInt16LE(files.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(offset, 16);
    return Buffer.concat([...localParts, ...centralParts, end]);
}

if (require.main === module) {
    const root = path.resolve(__dirname, '..');
    const output = path.join(root, 'dist/ghost-research-pro.zip');
    fs.mkdirSync(path.dirname(output), {recursive: true});
    // Remove stale output (or its symlink) before building; failures leave no
    // older archive that could be mistaken for the failed candidate.
    fs.rmSync(output, {force: true});
    const archive = buildArchive(root);
    fs.writeFileSync(output, archive, {flag: 'wx'});
    console.log(`Created dist/ghost-research-pro.zip (${archive.length} bytes)`);
    console.log(`SHA256 ${createHash('sha256').update(archive).digest('hex')}`);
}

module.exports = {buildArchive};
