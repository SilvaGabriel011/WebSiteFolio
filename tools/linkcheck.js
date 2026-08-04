/* Resolve every local href/src across the hub, all 12 sites and the app,
   and report anything that doesn't exist on disk. Catches exactly the class
   of bug the data-*.js filenames had. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.html$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let checked = 0, broken = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const refs = [];
  const re = /(?:href|src)\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) refs.push(m[1]);

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(ref)) continue;
    const target = ref.split('#')[0].split('?')[0];
    if (!target) continue;
    checked++;
    const resolved = path.resolve(dir, target);
    if (!fs.existsSync(resolved)) {
      broken++;
      console.log('BROKEN  ' + path.relative(ROOT, file) + '  →  ' + ref);
    }
  }
}

console.log('\n' + files.length + ' HTML files, ' + checked + ' local refs checked, ' + broken + ' broken');
process.exit(broken ? 1 : 0);
