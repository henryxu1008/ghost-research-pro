const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

process.chdir(path.resolve(__dirname, '..'));
const output = 'dist/ghost-research-pro.zip';
const templates = fs.readdirSync('.').filter(name => name.endsWith('.hbs')).sort();
for (const required of ['index.hbs', 'default.hbs', 'post.hbs', 'partials/card.hbs', 'assets/css/screen.css']) {
    if (!fs.existsSync(required)) throw new Error(`Missing required theme file: ${required}`);
}
fs.mkdirSync('dist', {recursive: true});
// Recreate the archive so deleted files cannot survive from previous builds.
fs.rmSync(output, {force: true});
execFileSync('zip', ['-q', '-r', output, ...templates, 'package.json', 'assets', 'partials', '-x', '*.map'], {stdio: 'inherit'});
console.log(`Created ${output}`);
