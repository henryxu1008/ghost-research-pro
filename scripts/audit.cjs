const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const levels = ['info', 'low', 'moderate', 'high', 'critical'];
const knownUrls = [
    'https://github.com/advisories/GHSA-jmr9-qjv8-65gv',
    'https://github.com/advisories/GHSA-7pqw-9j4j-h8q3',
];
// Reviewed development-only ZIP chain. No severity-wide suppression.
const knownPaths = {
    gscan: {version: '6.6.1', nodes: ['node_modules/gscan']},
    '@tryghost/zip': {version: '3.5.18', nodes: ['node_modules/@tryghost/zip']},
    'extract-zip': {version: '2.0.1', nodes: ['node_modules/extract-zip']},
};
const key = (name, version, node, url) => `${name}@${version} | ${node} | ${url}`;
const baseline = new Set(Object.entries(knownPaths).flatMap(([name, {version, nodes}]) => nodes.flatMap(node => knownUrls.map(url => key(name, version, node, url)))));

function classifyAudit(report, lockfile) {
    if (report?.error || report?.auditReportVersion !== 2 || !report.vulnerabilities || Array.isArray(report.vulnerabilities)) {
        throw new Error('Audit failed or returned an unsupported report');
    }
    const counts = Object.fromEntries(levels.map(level => [level, 0]));
    const critical = new Set();
    const high = new Set();
    const vulnerabilities = report.vulnerabilities;
    const sources = (name, seen = new Set()) => {
        if (seen.has(name)) return [];
        const vuln = vulnerabilities[name];
        if (!vuln || !Array.isArray(vuln.via)) throw new Error('Audit dependency chain is incomplete');
        const visited = new Set([...seen, name]);
        return vuln.via.flatMap(via => {
            if (typeof via === 'string') return sources(via, visited);
            if (!via || !levels.includes(via.severity) || typeof via.url !== 'string') throw new Error('Audit advisory data is invalid');
            return [via];
        });
    };
    for (const [name, vuln] of Object.entries(vulnerabilities)) {
        if (!levels.includes(vuln.severity) || !Array.isArray(vuln.nodes) || !vuln.nodes.length || !vuln.nodes.every(node => typeof node === 'string')) {
            throw new Error('Audit vulnerability data is invalid');
        }
        counts[vuln.severity]++;
        const advisories = sources(name);
        if (vuln.severity === 'critical' || advisories.some(advisory => advisory.severity === 'critical')) critical.add(name);
        if (vuln.severity === 'high') {
            const highSources = advisories.filter(advisory => advisory.severity === 'high' || advisory.severity === 'critical');
            if (!highSources.length) throw new Error('Audit high-severity chain has no advisory');
            for (const node of vuln.nodes) {
                const version = lockfile?.packages?.[node]?.version;
                if (typeof version !== 'string' || !version) throw new Error('Installed package version is missing from the lockfile');
                for (const advisory of highSources) high.add(key(name, version, node, advisory.url));
            }
        }
    }
    for (const level of levels) {
        if (report.metadata?.vulnerabilities?.[level] !== counts[level]) throw new Error('Audit severity counts are inconsistent');
    }
    if (report.metadata.vulnerabilities.total !== Object.values(counts).reduce((a, b) => a + b, 0)) throw new Error('Audit total is inconsistent');
    const knownHigh = [...high].filter(finding => baseline.has(finding)).sort();
    const newHigh = [...high].filter(finding => !baseline.has(finding)).sort();
    const removedKnownHigh = [...baseline].filter(finding => !high.has(finding)).sort();
    return {status: critical.size || newHigh.length ? 'failed' : 'passed', counts,
        critical: [...critical].sort(), knownHigh, newHigh, removedKnownHigh};
}

function readAuditReport(audit) {
    if (audit.error || ![0, 1].includes(audit.status)) throw new Error('npm audit could not complete; security gate fails closed');
    try { return JSON.parse(audit.stdout); } catch { throw new Error('npm audit did not return valid JSON'); }
}

function main() {
    const root = path.resolve(__dirname, '..');
    const command = process.env.npm_execpath ? process.execPath : (process.platform === 'win32' ? 'cmd.exe' : 'npm');
    const args = process.env.npm_execpath ? [process.env.npm_execpath, 'audit', '--json']
        : (process.platform === 'win32' ? ['/d', '/s', '/c', 'npm audit --json'] : ['audit', '--json']);
    const audit = spawnSync(command, args, {cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024, windowsHide: true});
    const report = readAuditReport(audit);
    const lockfile = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
    const result = classifyAudit(report, lockfile);
    fs.mkdirSync(path.join(root, 'artifacts'), {recursive: true});
    fs.writeFileSync(path.join(root, 'artifacts/dependency-audit.json'), JSON.stringify({result, report}, null, 2));
    console.log(`Audit nodes: ${result.counts.critical} critical, ${result.counts.high} high, ${result.counts.moderate} moderate`);
    for (const category of ['critical', 'knownHigh', 'newHigh', 'removedKnownHigh']) {
        for (const finding of result[category]) console.log(`${category}: ${finding}`);
    }
    if (result.knownHigh.length) console.log('Known high findings remain open; see docs/engineering/dependency-security.md.');
    if (result.removedKnownHigh.length) console.log('Removed means no longer reported as high on this path; it does not by itself prove an advisory was patched.');
    if (result.status === 'failed') process.exitCode = 1;
}

if (require.main === module) {
    try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = {classifyAudit, readAuditReport};
