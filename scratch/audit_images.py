import os
import re

public_files = set()
for root, dirs, files in os.walk('public'):
    for f in files:
        rel = '/' + os.path.relpath(os.path.join(root, f), 'public').replace('\\', '/')
        public_files.add(rel)

print(f"Total files in public: {len(public_files)}")

# Find all strings like "/projects/..." or "/team/..." or "/..."
img_pattern = re.compile(r'["\'](/[\w\.-]+(?:/[\w\.-]+)*\.(?:jpg|jpeg|png|webp|svg|ico|mp4))["\']', re.I)

missing = []
checked = 0

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.json')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            for m in img_pattern.finditer(content):
                img_path = m.group(1)
                checked += 1
                if img_path not in public_files:
                    missing.append((os.path.relpath(path, '.'), img_path))

print(f"Checked {checked} image references.")
print(f"Missing image references ({len(missing)}):")
for f, img in set(missing):
    print(f"  {f} -> {img}")
