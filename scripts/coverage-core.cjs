const fs = require('fs');
const path = require('path');

const covPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final.json');
if (!fs.existsSync(covPath)) {
  console.error('coverage-final.json not found at', covPath);
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(covPath, 'utf8'));

const targets = [
  path.resolve(__dirname, '..', 'src', 'store.js'),
  path.resolve(__dirname, '..', 'src', 'views.js')
];

let total = 0, covered = 0;
for (const t of targets) {
  const entry = data[t];
  if (!entry) {
    console.error('Coverage entry for', t, 'not found');
    continue;
  }
  const s = entry.s || {};
  const tcount = Object.keys(s).length;
  const ccount = Object.values(s).filter(v => v > 0).length;
  total += tcount;
  covered += ccount;
}

const pct = total ? (covered / total) * 100 : 0;
console.log(`Core files covered: ${covered} / ${total} (${pct.toFixed(2)}%)`);
const out = { covered, total, pct: Number(pct.toFixed(2)), files: targets };
fs.writeFileSync(path.resolve(__dirname, '..', 'coverage', 'coverage-core.json'), JSON.stringify(out, null, 2));
console.log('Wrote coverage/coverage-core.json');
