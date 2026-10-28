const assert = require('node:assert/strict');
const test = require('node:test');
const {classifyAudit} = require('../../scripts/audit.cjs');
const fixture = name => structuredClone(require(`./fixtures/${name}.json`));

test('known ZIP findings stay visible without failing the reviewed baseline', () => {
    const result = classifyAudit(fixture('known'));
    assert.equal(result.status, 'passed');
    assert.equal(result.counts.high, 3);
    assert.equal(result.knownHigh.length, 6);
    assert.deepEqual(result.newHigh, []);
    assert.deepEqual(result.removedKnownHigh, []);
});
test('critical regression blocks the gate', () => {
    const result = classifyAudit(fixture('critical'));
    assert.equal(result.status, 'failed');
    assert.deepEqual(result.critical, ['compiler']);
});
test('new high advisory blocks and is classified separately', () => {
    const result = classifyAudit(fixture('new-high'));
    assert.equal(result.status, 'failed');
    assert.equal(result.newHigh.length, 1);
    assert.deepEqual(result.knownHigh, []);
});
test('disappearing known findings are reported as removed, not silently retained', () => {
    const result = classifyAudit(fixture('clean'));
    assert.equal(result.status, 'passed');
    assert.equal(result.removedKnownHigh.length, 6);
    assert.equal(result.counts.high, 0);
});
test('partial removal reports only the disappearing dependency paths', () => {
    const report = fixture('known');
    delete report.vulnerabilities.gscan;
    report.metadata.vulnerabilities.high = 2;
    report.metadata.vulnerabilities.total = 2;
    const result = classifyAudit(report);
    assert.equal(result.status, 'passed');
    assert.equal(result.knownHigh.length, 4);
    assert.equal(result.removedKnownHigh.length, 2);
});
test('the same advisory on a new dependency path is not suppressed', () => {
    const report = fixture('known');
    report.vulnerabilities['extract-zip'].nodes.push('node_modules/new-parent/node_modules/extract-zip');
    const result = classifyAudit(report);
    assert.equal(result.status, 'failed');
    assert.equal(result.newHigh.length, 2);
});
test('an advisory becoming critical cannot inherit the high baseline', () => {
    const report = fixture('known');
    report.vulnerabilities['extract-zip'].via[0].severity = 'critical';
    assert.equal(classifyAudit(report).status, 'failed');
});
test('network/service errors fail closed', () => {
    assert.throws(() => classifyAudit({error: {code: 'EAUDITUNAVAILABLE'}}), /Audit failed/);
});
test('missing chains and unresolved cycles fail closed', () => {
    const missing = fixture('known');
    delete missing.vulnerabilities['extract-zip'];
    assert.throws(() => classifyAudit(missing), /incomplete/);
    const cycle = fixture('known');
    cycle.vulnerabilities['extract-zip'].via = ['gscan'];
    assert.throws(() => classifyAudit(cycle), /no advisory/);
});
test('invalid schema and inconsistent totals fail closed', () => {
    const report = fixture('known');
    report.metadata.vulnerabilities.high = 0;
    assert.throws(() => classifyAudit(report), /inconsistent/);
    assert.throws(() => classifyAudit({auditReportVersion: 1}), /unsupported/);
});
