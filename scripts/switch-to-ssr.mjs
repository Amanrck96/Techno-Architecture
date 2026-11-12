/**
 * Techno Architecture — Switch Mode: Cloud Functions SSR (Full Cloud Workflow)
 * 
 * Re-enables Next.js SSR with Cloud Functions & Firebase Cloud Storage:
 * - Restores media URLs in CMS to Firebase Cloud Storage (technoarchitecture-7d718.firebasestorage.app)
 * - Updates firebase.json to use Next.js Web Frameworks ("source": ".")
 * - Run this when the Google Cloud billing account is active/cleared.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Switching to Cloud SSR & Storage Mode...');

// 1. Switch CMS media URLs to Firebase Cloud Storage
execSync('node scripts/switch-media-source.mjs --to-cloud', { cwd: rootDir, stdio: 'inherit' });

// 2. Update firebase.json
const firebaseSsrConfig = {
  firestore: {
    rules: "firestore.rules",
    indexes: "firestore.indexes.json"
  },
  storage: {
    rules: "storage.rules"
  },
  hosting: {
    source: ".",
    cleanUrls: true,
    trailingSlash: false,
    ignore: [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.mp4",
      "**/*.mov",
      "**/*.avi",
      "**/*.webm",
      "**/*.zip",
      "**/*.tar.gz",
      "**/cms-backup*.json"
    ]
  }
};

fs.writeFileSync(path.join(rootDir, 'firebase.json'), JSON.stringify(firebaseSsrConfig, null, 2), 'utf8');
console.log('✅ firebase.json updated to use Cloud Functions SSR (source: ".")');
console.log('🎉 Ready for cloud deploy! Run: firebase deploy --only hosting');

