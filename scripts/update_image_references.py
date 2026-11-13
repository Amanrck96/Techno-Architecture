import os
import re

TARGET_FILES = [
    'src/data/projects.ts',
    'src/data/gallery.ts',
    'src/data/team.ts',
    'src/data/cms-content.json',
    'src/lib/cmsStore.ts',
    'src/components/home/LandingGallery.tsx',
    'src/components/home/HomeIntro.tsx',
    'src/components/home/HeroSection.tsx',
    'src/app/admin/AdminClient.tsx',
    'scripts/prepare-static-dist.mjs'
]

# Pattern to replace image extensions in project/team/gallery paths
# E.g., /projects/aikya/elevation-east.jpg -> /projects/aikya/elevation-east.webp
# /team/rajesh.jpg -> /team/rajesh.webp
regex = re.compile(r'(/projects/[^"\'\s)]+?)\.(jpg|jpeg|png)', re.IGNORECASE)
regex_team = re.compile(r'(/team/[^"\'\s)]+?)\.(jpg|jpeg|png)', re.IGNORECASE)
regex_uploads = re.compile(r'(/uploads/[^"\'\s)]+?)\.(jpg|jpeg|png)', re.IGNORECASE)

total_replacements = 0

for file_path in TARGET_FILES:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content, count1 = regex.subn(r'\1.webp', content)
    new_content, count2 = regex_team.subn(r'\1.webp', new_content)
    new_content, count3 = regex_uploads.subn(r'\1.webp', new_content)
    total_file = count1 + count2 + count3

    if total_file > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {total_file} references in {file_path}")
        total_replacements += total_file

print(f"\nTotal image references updated to .webp: {total_replacements}")

