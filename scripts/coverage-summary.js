const fs = require('fs');
const path = require('path');

const covPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final.json');
if (!fs.existsSync(covPath)) {
  console.error('coverage-final.json not found at', covPath);
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(covPath, 'utf8'));

function fileStats(entry) {
  const s = entry.s || {};
  const total = Object.keys(s).length;
  const covered = Object.values(s).filter(v => v > 0).length;
  return { total, covered };
}

const files = Object.keys(data).filter(f => f.startsWith(path.resolve(__dirname, '..', 'src')));

let totalAll = 0, coveredAll = 0;
let totalFiltered = 0, coveredFiltered = 0;

for (const file of Object.keys(data)) {
  const stats = fileStats(data[file]);
  totalAll += stats.total;
  coveredAll += stats.covered;
}

for (const file of files) {
  const stats = fileStats(data[file]);
  totalFiltered += stats.total;
  coveredFiltered += stats.covered;
}

const overallPct = totalAll ? (coveredAll / totalAll) * 100 : 0;
const srcPct = totalFiltered ? (coveredFiltered / totalFiltered) * 100 : 0;

console.log('Computed coverage from', covPath);
console.log('Overall statements:', coveredAll, '/', totalAll, `(${overallPct.toFixed(2)}%)`);
console.log('Source (src/) statements:', coveredFiltered, '/', totalFiltered, `(${srcPct.toFixed(2)}%)`);

// Write a small summary file
const out = {
  overall: { covered: coveredAll, total: totalAll, pct: Number(overallPct.toFixed(2)) },
  src: { covered: coveredFiltered, total: totalFiltered, pct: Number(srcPct.toFixed(2)) },
  generatedAt: new Date().toISOString()
};
fs.writeFileSync(path.resolve(__dirname, '..', 'coverage', 'coverage-summary.json'), JSON.stringify(out, null, 2));
console.log('Wrote coverage/coverage-summary.json');
