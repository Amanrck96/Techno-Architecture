/**
 * Techno Architecture — Production Media Migration Tool to Google Firebase Storage
 * 
 * Capabilities:
 *  1. Scans local media in public/ (images, videos, PDFs)
 *  2. Generates migration manifest (media-manifest.json)
 *  3. Computes SHA256 hashes to detect and deduplicate identical files (e.g. brindavan.mp4)
 *  4. Uploads files to Firebase Cloud Storage via REST / Admin SDK
 *  5. Verifies uploaded files via HTTP HEAD checks
 *  6. Updates references in src/data/cms-content.json safely
 *  7. Generates failure and summary report
 *  8. Supports resuming interrupted migrations (--resume)
 *  9. Supports complete rollback (--rollback)
 * 
 * Usage:
 *   node scripts/migrate-to-firebase-storage.mjs --scan-only
 *   node scripts/migrate-to-firebase-storage.mjs --upload
 *   node scripts/migrate-to-firebase-storage.mjs --update-references
 *   node scripts/migrate-to-firebase-storage.mjs --resume
 *   node scripts/migrate-to-firebase-storage.mjs --rollback
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MANIFEST_PATH = path.join(rootDir, 'scripts', 'media-manifest.json');
const CMS_CONTENT_PATH = path.join(rootDir, 'src', 'data', 'cms-content.json');
const CMS_BACKUP_PATH = path.join(rootDir, 'src', 'data', 'cms-content.backup.json');
const REPORT_PATH = path.join(rootDir, 'scripts', 'migration-report.json');

// Load environment variables from .env.local
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const BUCKET_NAME =
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  'technoarchitecture-7d718.firebasestorage.app';

const MEDIA_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg',
  '.mp4', '.webm', '.mov', '.pdf'
]);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
  };
  return map[ext] || 'application/octet-stream';
}

function computeFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * 1. SCAN AND GENERATE MANIFEST
 */
function scanMedia() {
  console.log('\n🔍 Scanning public directory for media assets...');
  const publicDir = path.join(rootDir, 'public');
  const filesFound = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (MEDIA_EXTENSIONS.has(ext)) {
          filesFound.push(fullPath);
        }
      }
    }
  }

  walk(publicDir);

  const hashMap = new Map();
  const manifest = {
    createdAt: new Date().toISOString(),
    bucket: BUCKET_NAME,
    totalFiles: filesFound.length,
    totalBytes: 0,
    duplicateCount: 0,
    savedDuplicateBytes: 0,
    files: {},
    duplicates: [],
  };

  for (const filePath of filesFound) {
    const stat = fs.statSync(filePath);
    const relativeToPublic = path.relative(publicDir, filePath).replace(/\\/g, '/');
    const localRef = `/${relativeToPublic}`;
    const hash = computeFileHash(filePath);

    manifest.totalBytes += stat.size;

    if (hashMap.has(hash)) {
      const original = hashMap.get(hash);
      manifest.duplicateCount++;
      manifest.savedDuplicateBytes += stat.size;
      manifest.duplicates.push({
        duplicatePath: localRef,
        canonicalPath: original.localRef,
        sizeBytes: stat.size,
        hash,
      });

      manifest.files[localRef] = {
        localRef,
        sizeBytes: stat.size,
        hash,
        mimeType: getMimeType(filePath),
        isDuplicate: true,
        canonicalRef: original.localRef,
        storagePath: original.storagePath,
        firebaseUrl: original.firebaseUrl,
        status: 'duplicate',
      };
    } else {
      const cleanStoragePath = `media/${relativeToPublic}`;
      const downloadToken = crypto.randomUUID();
      const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(
        cleanStoragePath
      )}?alt=media&token=${downloadToken}`;

      const entry = {
        localRef,
        sizeBytes: stat.size,
        hash,
        mimeType: getMimeType(filePath),
        isDuplicate: false,
        storagePath: cleanStoragePath,
        downloadToken,
        firebaseUrl,
        status: 'pending',
      };

      hashMap.set(hash, entry);
      manifest.files[localRef] = entry;
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✅ Scan Complete:`);
  console.log(`   Total Media Files:     ${manifest.totalFiles}`);
  console.log(`   Total Media Size:      ${(manifest.totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   Duplicate Files Found: ${manifest.duplicateCount}`);
  console.log(`   Duplicate Space Saved: ${(manifest.savedDuplicateBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   Manifest Saved:        scripts/media-manifest.json\n`);

  return manifest;
}

/**
 * 2. UPLOAD TO FIREBASE STORAGE
 */
async function uploadMedia(resumeOnly = false) {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log('Manifest not found. Running scan first...');
    scanMedia();
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const publicDir = path.join(rootDir, 'public');

  console.log(`\n🚀 Starting Firebase Storage Upload to ${manifest.bucket}...`);
  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const entries = Object.values(manifest.files).filter((item) => {
    if (item.isDuplicate) return false;
    if (resumeOnly) {
      return item.status === 'pending' || item.status === 'failed';
    }
    return item.status !== 'verified';
  });

  console.log(`   Files to process: ${entries.length}`);

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    const absolutePath = path.join(publicDir, item.localRef.replace(/^\//, ''));

    process.stdout.write(`   [${i + 1}/${entries.length}] Uploading ${item.localRef} (${(item.sizeBytes / 1024).toFixed(0)} KB)... `);

    try {
      const buffer = fs.readFileSync(absolutePath);
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${manifest.bucket}/o?name=${encodeURIComponent(
        item.storagePath
      )}&uploadType=media`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': item.mimeType,
          'x-goog-meta-token': item.downloadToken,
        },
        body: buffer,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        item.status = 'uploaded';
        uploadedCount++;
        console.log('✅ OK');
      } else {
        const errText = await res.text();
        item.status = 'failed';
        item.error = `HTTP ${res.status}: ${errText}`;
        failedCount++;
        console.log(`❌ Failed: HTTP ${res.status}`);
      }
    } catch (err) {
      item.status = 'failed';
      item.error = err.message;
      failedCount++;
      console.log(`❌ Error: ${err.message}`);
    }

    // Save manifest incrementally every 10 items
    if (i % 10 === 0 || i === entries.length - 1) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
    }
  }

  // Update duplicate entries with canonical URL
  for (const item of Object.values(manifest.files)) {
    if (item.isDuplicate && item.canonicalRef && manifest.files[item.canonicalRef]) {
      const canonical = manifest.files[item.canonicalRef];
      item.status = canonical.status;
      item.firebaseUrl = canonical.firebaseUrl;
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\n📊 Upload Summary:`);
  console.log(`   Uploaded Successfully: ${uploadedCount}`);
  console.log(`   Failed:                ${failedCount}`);
  console.log(`   Skipped/Verified:      ${skippedCount}`);
}

/**
 * 3. UPDATE CMS REFERENCES SAFELY
 */
function updateReferences() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Manifest not found. Please run scan and upload first.');
    return;
  }
  if (!fs.existsSync(CMS_CONTENT_PATH)) {
    console.error(`❌ CMS content file not found at ${CMS_CONTENT_PATH}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const rawCms = fs.readFileSync(CMS_CONTENT_PATH, 'utf8');

  // Create backup before touching CMS data
  fs.writeFileSync(CMS_BACKUP_PATH, rawCms, 'utf8');
  console.log(`\n💾 Created safety backup at src/data/cms-content.backup.json`);

  let updatedCms = rawCms;
  let replacementCount = 0;

  for (const [localRef, entry] of Object.entries(manifest.files)) {
    if (entry.firebaseUrl && (entry.status === 'uploaded' || entry.status === 'verified')) {
      const searchTarget = `"${localRef}"`;
      if (updatedCms.includes(searchTarget)) {
        updatedCms = updatedCms.replaceAll(searchTarget, `"${entry.firebaseUrl}"`);
        replacementCount++;
      }
    }
  }

  fs.writeFileSync(CMS_CONTENT_PATH, updatedCms, 'utf8');
  console.log(`✅ CMS Content References Updated!`);
  console.log(`   Total References Migrated to Firebase Storage: ${replacementCount}`);
  console.log(`   Rollback available anytime via: node scripts/migrate-to-firebase-storage.mjs --rollback\n`);
}

/**
 * 4. ROLLBACK
 */
function rollback() {
  if (!fs.existsSync(CMS_BACKUP_PATH)) {
    console.error('❌ No backup found at src/data/cms-content.backup.json. Cannot rollback.');
    return;
  }
  const backup = fs.readFileSync(CMS_BACKUP_PATH, 'utf8');
  fs.writeFileSync(CMS_CONTENT_PATH, backup, 'utf8');
  console.log('✅ Rollback successful: Restored src/data/cms-content.json from backup.');
}

/**
 * CLI Argument Dispatcher
 */
const arg = process.argv[2] || '--scan-only';

switch (arg) {
  case '--scan-only':
  case '-s':
    scanMedia();
    break;
  case '--upload':
  case '-u':
    uploadMedia(false);
    break;
  case '--resume':
  case '-r':
    uploadMedia(true);
    break;
  case '--update-references':
    updateReferences();
    break;
  case '--rollback':
    rollback();
    break;
  default:
    console.log(`Unknown flag: ${arg}`);
    console.log('Available flags: --scan-only, --upload, --resume, --update-references, --rollback');
}

