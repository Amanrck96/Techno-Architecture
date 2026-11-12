/**
 * Techno Architecture — Media Source Switcher
 * 
 * Allows toggling between:
 *  --to-local: Decodes Firebase Storage URLs to local static files (/projects/..., /team/...)
 *              Eliminates 402 Payment Required errors and enables 100% free static hosting.
 *  --to-cloud: Restores Firebase Cloud Storage URLs when billing/account is active.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CMS_PATH = path.join(rootDir, 'src', 'data', 'cms-content.json');
const CLOUD_BACKUP_PATH = path.join(rootDir, 'src', 'data', 'cms-content.cloud-storage.json');
const LOCAL_BACKUP_PATH = path.join(rootDir, 'src', 'data', 'cms-content.local.json');

const mode = process.argv[2];

if (mode === '--to-local') {
  console.log('🔄 Converting CMS media URLs to local static assets...');
  const current = fs.readFileSync(CMS_PATH, 'utf8');
  
  // Save current as cloud backup if not already saved
  if (!fs.existsSync(CLOUD_BACKUP_PATH)) {
    fs.writeFileSync(CLOUD_BACKUP_PATH, current, 'utf8');
    console.log('💾 Saved cloud URLs backup to:', CLOUD_BACKUP_PATH);
  }

  let convertedCount = 0;
  const replaced = current.replace(
    /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/technoarchitecture-7d718\.firebasestorage\.app\/o\/([^"?]+)(\?[^"]*)?/g,
    (match, encodedPath) => {
      const decoded = decodeURIComponent(encodedPath);
      // Skip the heavy 92MB video to prevent downloading it
      if (decoded.endsWith('.mp4')) {
        return match;
      }
      convertedCount++;
      return `/${decoded}`;
    }
  );

  fs.writeFileSync(CMS_PATH, replaced, 'utf8');
  fs.writeFileSync(LOCAL_BACKUP_PATH, replaced, 'utf8');
  console.log(`✅ Converted ${convertedCount} URLs to local static paths.`);
} else if (mode === '--to-cloud') {
  console.log('🔄 Restoring CMS media URLs to Firebase Cloud Storage...');
  if (fs.existsSync(CLOUD_BACKUP_PATH)) {
    const cloudContent = fs.readFileSync(CLOUD_BACKUP_PATH, 'utf8');
    fs.writeFileSync(CMS_PATH, cloudContent, 'utf8');
    console.log('✅ Restored Firebase Cloud Storage URLs from backup.');
  } else {
    console.error('❌ Cloud backup not found at:', CLOUD_BACKUP_PATH);
  }
} else {
  console.log('Usage: node scripts/switch-media-source.mjs [--to-local | --to-cloud]');
}

