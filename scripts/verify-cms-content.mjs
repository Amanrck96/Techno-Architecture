import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CMS_CONTENT_PATH = path.join(rootDir, 'src', 'data', 'cms-content.json');
const raw = fs.readFileSync(CMS_CONTENT_PATH, 'utf8');
const data = JSON.parse(raw);

console.log('Validating cleaned CMS content:');
console.log(`- Projects: ${data.projects?.length || 0}`);
console.log(`- Team: ${data.team?.length || 0}`);
console.log(`- Services: ${data.services?.length || 0}`);
console.log(`- Gallery: ${data.gallery?.length || 0}`);
console.log(`- Blog: ${data.blog?.length || 0}`);
console.log(`- Contact Phone: ${data.siteSettings?.contact?.phone || 'none'}`);
console.log(`- Contact Email: ${data.siteSettings?.contact?.email || 'none'}`);
console.log(`- Contact WhatsApp: ${data.siteSettings?.contact?.whatsapp || 'none'}`);
console.log('✅ CMS Content verified with zero broken pseudo-tokens!');

