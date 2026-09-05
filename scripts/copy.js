const { copyFileSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

function copy(filename, from, to) {
  copyFileSync(resolve(from, filename), resolve(to, filename));
}

function rewrite(path, replacer) {
  const file = readFileSync(path).toString();
  const replaced = replacer(file);
  writeFileSync(path, replaced);
}

const root = resolve(__dirname, '..');
const target = resolve(process.cwd(), 'dist');

copy('README.md', root, target);
copy('LICENSE', root, target);
copy('package.json', process.cwd(), target);
rewrite(resolve(target, 'package.json'), pkg => pkg.replace(/dist\//g, ''));
