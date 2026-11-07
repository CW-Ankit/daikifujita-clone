const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

function getFiles(dir, files = []) {
  const fullDir = path.resolve(projectRoot, dir);
  if (!fs.existsSync(fullDir)) return files;
  for (const f of fs.readdirSync(fullDir)) {
    const full = path.join(fullDir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') getFiles(path.join(dir, f), files);
    } else {
      if (/\.(tsx|ts|jsx|js|css)$/.test(f)) files.push(full);
    }
  }
  return files;
}

const files = [...getFiles('app'), ...getFiles('components'), ...getFiles('lib')];
const regex = /['"](\/(images|models|textures)\/[^'"]+)['"]/g;
let missing = 0;
let checked = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(code)) !== null) {
    checked++;
    const assetPath = path.join(projectRoot, 'public', match[1]);
    if (!fs.existsSync(assetPath)) {
      console.error(`File: ${path.relative(projectRoot, file)} references MISSING asset: ${match[1]}`);
      missing++;
    }
  }
}
console.log(`Done scanning! Total asset references checked: ${checked}, Missing: ${missing}`);
if (missing > 0) {
  process.exit(1);
}
