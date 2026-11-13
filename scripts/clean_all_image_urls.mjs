import fs from 'fs';

function cleanFirebaseStorageUrls(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(
    /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/technoarchitecture-7d718\.firebasestorage\.app\/o\/projects%2F([^"'\s?]+)(\?alt=media(?:&token=[^"'\s]+)?)?/g,
    (match, p1) => {
      const decoded = decodeURIComponent(p1);
      return `/projects/${decoded}`;
    }
  );
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${filePath}: Cleaned Firebase Storage URLs to local static paths.`);
  } else {
    console.log(`No changes needed in ${filePath}`);
  }
}

cleanFirebaseStorageUrls('src/data/projects.ts');
cleanFirebaseStorageUrls('src/data/gallery.ts');
cleanFirebaseStorageUrls('src/data/cms-content.json');

