import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const teamPath = path.join(rootDir, 'src', 'data', 'team.ts');
let code = fs.readFileSync(teamPath, 'utf8');

const regex = /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/technoarchitecture-7d718\.firebasestorage\.app\/o\/team%2F([^"?]+)(\?[^"]*)?/g;
let count = 0;
code = code.replace(regex, (match, filename) => {
  count++;
  return `/team/${decodeURIComponent(filename)}`;
});

fs.writeFileSync(teamPath, code, 'utf8');
console.log(`✅ Converted ${count} team images in team.ts to local paths.`);
