/**
 * Techno Architecture — Switch Mode: Pure Static Hosting (100% Free / Zero Billing)
 * 
 * Configures the project for static CDN deployment:
 * - Switches media URLs in CMS to local static assets (/projects/..., /team/...)
 * - Updates firebase.json to deploy dist_static/ directly (no Cloud Functions / zero compute costs)
 * - Sets aggressive Edge CDN caching headers
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Switching to Static Free-Tier Hosting Mode...');

// 1. Switch CMS media URLs to local static assets
execSync('node scripts/switch-media-source.mjs --to-local', { cwd: rootDir, stdio: 'inherit' });

// 2. Prepare static distribution
execSync('node scripts/prepare-static-dist.mjs', { cwd: rootDir, stdio: 'inherit' });

// 3. Update firebase.json
const firebaseStaticConfig = {
  firestore: {
    rules: "firestore.rules",
    indexes: "firestore.indexes.json"
  },
  storage: {
    rules: "storage.rules"
  },
  hosting: {
    public: "dist_static",
    cleanUrls: true,
    trailingSlash: false,
    ignore: [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    headers: [
      {
        source: "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "**/*.html",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate"
          }
        ]
      }
    ]
  }
};

fs.writeFileSync(path.join(rootDir, 'firebase.json'), JSON.stringify(firebaseStaticConfig, null, 2), 'utf8');
console.log('✅ firebase.json updated to point to dist_static/');
console.log('🎉 Ready to deploy! Run: firebase deploy --only hosting');
