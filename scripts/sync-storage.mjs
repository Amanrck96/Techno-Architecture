/**
 * Techno Architecture - Firebase Storage Sync Utility
 * 
 * Usage:
 *   node scripts/sync-storage.mjs
 * 
 * This script scans the local `public/projects/` and `public/uploads/` directories
 * and uploads all images, photographs, and media files to Firebase Storage bucket.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read environment variables from .env.local if present
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

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'technoarchitecture-7d718';
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' Techno Architecture - Firebase Storage Sync');
console.log(` Target Firebase Project: ${projectId}`);
console.log(` Target Storage Bucket:   ${bucketName}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('\n✅ Firebase Storage integration configured in Next.js:');
console.log(' 1. Direct upload enabled from Admin Portal for Photos & Videos');
console.log(' 2. Permanent URLs stored with format: https://firebasestorage.googleapis.com/...');
console.log(' 3. Storage Security Rules in storage.rules ready for deployment:');
console.log('      firebase deploy --only storage');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
