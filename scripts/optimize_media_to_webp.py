import os
import io
import re
from PIL import Image

MAX_BYTES = 150 * 1024  # 150 KB hard cap

IMAGE_DIRS = ['public/projects', 'public/team', 'public/uploads']

converted_count = 0
total_orig_bytes = 0
total_webp_bytes = 0
file_map = {}  # old_rel_path -> new_rel_path

print("Starting image optimization to WebP (max <= 150 KB each)...")

for dir_path in IMAGE_DIRS:
    if not os.path.exists(dir_path):
        continue
    for root, dirs, files in os.walk(dir_path):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ('.jpg', '.jpeg', '.png'):
                old_path = os.path.join(root, f)
                new_f = os.path.splitext(f)[0] + '.webp'
                new_path = os.path.join(root, new_f)

                orig_size = os.path.getsize(old_path)
                total_orig_bytes += orig_size

                try:
                    im = Image.open(old_path)
                    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                        # keep alpha
                        pass
                    else:
                        im = im.convert('RGB')

                    # Max dimension strategy
                    max_dim = 1440
                    if max(im.width, im.height) > max_dim:
                        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

                    quality = 75
                    buf = io.BytesIO()
                    im.save(buf, 'WEBP', quality=quality, method=5)

                    # Adaptive reduction if > 150 KB
                    while buf.tell() > MAX_BYTES and quality > 40:
                        quality -= 8
                        buf = io.BytesIO()
                        im.save(buf, 'WEBP', quality=quality, method=5)

                    if buf.tell() > MAX_BYTES:
                        im.thumbnail((1080, 1080), Image.Resampling.LANCZOS)
                        quality = 55
                        buf = io.BytesIO()
                        im.save(buf, 'WEBP', quality=quality, method=5)

                    if buf.tell() > MAX_BYTES:
                        im.thumbnail((800, 800), Image.Resampling.LANCZOS)
                        quality = 50
                        buf = io.BytesIO()
                        im.save(buf, 'WEBP', quality=quality, method=5)

                    with open(new_path, 'wb') as out_f:
                        out_f.write(buf.getvalue())

                    webp_size = os.path.getsize(new_path)
                    total_webp_bytes += webp_size
                    converted_count += 1

                    # Track relative path for source code replacement
                    rel_old = '/' + os.path.relpath(old_path, 'public').replace('\\', '/')
                    rel_new = '/' + os.path.relpath(new_path, 'public').replace('\\', '/')
                    file_map[rel_old] = rel_new

                    # Remove old JPG/PNG to free disk space and prevent inclusion in build
                    if old_path != new_path and os.path.exists(old_path):
                        os.remove(old_path)

                except Exception as e:
                    print(f"Error converting {old_path}: {e}")

print(f"\nOptimization Complete!")
print(f"Total images converted: {converted_count}")
print(f"Original total size: {total_orig_bytes / (1024*1024):.2f} MB")
print(f"WebP total size: {total_webp_bytes / (1024*1024):.2f} MB")
if total_orig_bytes > 0:
    print(f"Total Bandwidth Savings: {((1 - total_webp_bytes / total_orig_bytes) * 100):.1f}%")

# Save path mapping for reference
import json
with open('scripts/webp_map.json', 'w') as mf:
    json.dump(file_map, mf, indent=2)
print("Saved mapping to scripts/webp_map.json")

