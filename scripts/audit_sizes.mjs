import fs from 'fs';
import path from 'path';

const distDir = 'dist_static';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size });
    }
  }
  return results;
}

const allFiles = getFiles(distDir);
const largeFiles = allFiles
  .filter(f => f.size > 100 * 1024)
  .sort((a, b) => b.size - a.size);

console.log(`=== AUDIT: FILES LARGER THAN 100 KB (Total: ${largeFiles.length}) ===`);
let totalLargeSize = 0;
largeFiles.forEach((f, idx) => {
  totalLargeSize += f.size;
  const relPath = path.relative(distDir, f.path).replace(/\\/g, '/');
  const sizeKB = (f.size / 1024).toFixed(1);
  const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
  console.log(`${idx + 1}. [${sizeKB} KB / ${sizeMB} MB] /${relPath}`);
});
console.log(`\nTotal weight of files > 100KB: ${(totalLargeSize / (1024 * 1024)).toFixed(2)} MB`);

// Analyze Home Page Weight
// Home page loads: index.html (or home.html), JS bundles, CSS, fonts, and media referenced on landing page
const indexHtmlStat = fs.statSync(path.join(distDir, 'index.html'));
console.log(`\n=== HOME PAGE INITIAL LOAD WEIGHT (CURRENT) ===`);
console.log(`index.html: ${(indexHtmlStat.size / 1024).toFixed(1)} KB`);

// Check video
const videoPath = path.join(distDir, 'brindavan_hero.mp4');
if (fs.existsSync(videoPath)) {
  const vStat = fs.statSync(videoPath);
  console.log(`brindavan_hero.mp4 (autoplay video): ${(vStat.size / (1024 * 1024)).toFixed(2)} MB`);
}

