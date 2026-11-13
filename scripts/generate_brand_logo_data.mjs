import fs from 'fs';

const buf = fs.readFileSync('public/techno-brand-logo.png');
const b64 = buf.toString('base64');
const dataUri = `data:image/png;base64,${b64}`;

const code = `/**
 * Embedded Base64 Data URI for Techno Architecture Brand Logo
 * 
 * Auto-generated to guarantee 100% offline reliability, instant 0ms render,
 * zero network requests, and absolute immunity against HTTP 509/404/402 errors.
 */

export const TECHNO_BRAND_LOGO_DATA_URI = "${dataUri}";
`;

fs.writeFileSync('src/components/common/brandLogoData.ts', code, 'utf8');
console.log('Generated src/components/common/brandLogoData.ts successfully!');

