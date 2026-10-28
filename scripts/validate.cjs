const path = require('node:path');
const fs = require('node:fs');
const gscan = require('gscan');

async function main() {
    const target = path.resolve(process.argv[2] || '.');
    if (!fs.existsSync(target)) throw new Error(`Theme not found: ${target}`);
    for (const version of ['v5', 'v6']) {
        const options = {checkVersion: version};
        const raw = target.endsWith('.zip')
            ? await gscan.checkZip(target, options)
            : await gscan.check(target, options);
        const {results} = gscan.format(raw, options);
        console.log(`Ghost ${version}: ${results.error.length} errors, ${results.warning.length} warnings`);
        for (const result of [...results.error, ...results.warning]) console.log(`${result.level}: ${result.rule}`);
        if (results.error.length || results.warning.length) process.exitCode = 1;
    }
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
