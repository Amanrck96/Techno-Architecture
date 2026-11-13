/**
 * Techno Architecture — Static Distribution Generator
 * 
 * Assembles the pre-rendered Next.js production build into dist_static/
 * for 100% free, zero-maintenance Firebase Hosting deployment without Cloud Functions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nextServerApp = path.join(rootDir, '.next', 'server', 'app');
const nextStatic = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist_static');

function copyRecursiveSync(src, dest, ignoreExts = []) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, item), path.join(dest, item), ignoreExts);
    }
  } else {
    const ext = path.extname(src).toLowerCase();
    if (ignoreExts.includes(ext)) return;
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('🚀 Preparing static distribution in dist_static/...');

// 1. Clean previous dist_static
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Copy public directory assets (including optimized hero video)
console.log('📂 Copying public assets (including optimized brindavan_hero.mp4)...');
function copyPublicAssets(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyPublicAssets(path.join(src, item), path.join(dest, item));
    }
  } else {
    const ext = path.extname(src).toLowerCase();
    const basename = path.basename(src).toLowerCase();
    // Exclude heavy video formats, but explicitly copy the 3.15MB brindavan_hero.mp4
    if (['.mov', '.avi', '.webm'].includes(ext)) return;
    if (ext === '.mp4' && basename !== 'brindavan_hero.mp4') return;
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}
copyPublicAssets(publicDir, distDir);

// 3. Copy Next.js static assets (_next/static)
console.log('📦 Copying Next.js JS/CSS bundles to _next/static...');
const destNextStatic = path.join(distDir, '_next', 'static');
copyRecursiveSync(nextStatic, destNextStatic);

// 4. Copy pre-rendered HTML files from .next/server/app
console.log('📄 Copying pre-rendered HTML pages...');
function copyHtmlFiles(dir, relativePath = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      copyHtmlFiles(fullPath, path.join(relativePath, item));
    } else if (item.endsWith('.html')) {
      const destPath = path.join(distDir, relativePath, item);
      const destParent = path.dirname(destPath);
      if (!fs.existsSync(destParent)) fs.mkdirSync(destParent, { recursive: true });
      fs.copyFileSync(fullPath, destPath);
    }
  }
}
copyHtmlFiles(nextServerApp);

// 5. Ensure root index.html exists
const rootIndex = path.join(distDir, 'index.html');
const homeHtml = path.join(distDir, 'home.html');
if (!fs.existsSync(rootIndex) && fs.existsSync(homeHtml)) {
  fs.copyFileSync(homeHtml, rootIndex);
  console.log('📌 Mirrored home.html to index.html');
}

// 6. Report total size
let totalBytes = 0;
let fileCount = 0;
function countFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const s = fs.statSync(p);
    if (s.isDirectory()) countFiles(p);
    else { totalBytes += s.size; fileCount++; }
  }
}
countFiles(distDir);

console.log(`✅ Static distribution created successfully!`);
console.log(`   Files: ${fileCount}`);
console.log(`   Total Size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Location: ${distDir}`);

