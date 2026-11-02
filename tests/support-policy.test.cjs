const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {createRequire} = require('node:module');
const semver = createRequire(require.resolve('gscan/package.json'))('semver');
const root = path.resolve(__dirname, '..');

test('installation metadata permits Ghost 6 and excludes EOL/unverified majors', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
    const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json')));
    assert.equal(semver.satisfies('6.73.0', pkg.engines.ghost), true);
    for (const version of ['5.130.6', '7.0.0', '7.0.0-beta.1']) {
        assert.equal(semver.satisfies(version, pkg.engines.ghost), false, `${version} is outside current support`);
    }
    assert.deepEqual(lock.packages[''].engines, pkg.engines);
});

test('runtime rejects historical or unverified Ghost before starting a site', () => {
    for (const version of ['5.130.6', '7.0.0']) {
        const env = {...process.env, GHOST_RUNTIME_VERSION: version};
        delete env.GHOST_RUNTIME_DIR;
        delete env.GHOST5_PORTAL_MODE;
        const result = spawnSync(process.execPath, ['tests/runtime/acceptance.cjs'], {cwd: root, env, encoding: 'utf8'});
        assert.equal(result.status, 1);
        assert.match(result.stderr, /Current runtime acceptance supports only Ghost 6\.73\.0/);
    }
});
