import os
import io
from PIL import Image

TARGET_DIRS = ['public/projects', 'public/team']
THUMB_WIDTH = 400
THUMB_QUALITY = 72

created_count = 0
total_thumb_bytes = 0

print("Generating 400px WebP thumbnails...")

for dir_path in TARGET_DIRS:
    if not os.path.exists(dir_path):
        continue
    for root, dirs, files in os.walk(dir_path):
        for f in files:
            if f.endswith('.webp') and not f.endswith('-thumb.webp'):
                src_path = os.path.join(root, f)
                thumb_name = os.path.splitext(f)[0] + '-thumb.webp'
                thumb_path = os.path.join(root, thumb_name)

                try:
                    im = Image.open(src_path)
                    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                        pass
                    else:
                        im = im.convert('RGB')

                    # Resize to 400px width while preserving aspect ratio
                    w, h = im.size
                    new_h = int(h * (THUMB_WIDTH / w))
                    im = im.resize((THUMB_WIDTH, new_h), Image.Resampling.LANCZOS)

                    im.save(thumb_path, 'WEBP', quality=THUMB_QUALITY, method=4)
                    thumb_size = os.path.getsize(thumb_path)
                    total_thumb_bytes += thumb_size
                    created_count += 1
                except Exception as e:
                    print(f"Error creating thumb for {src_path}: {e}")

print(f"\nThumbnails Generation Complete!")
print(f"Total thumbnails created: {created_count}")
print(f"Average thumbnail size: {(total_thumb_bytes / created_count / 1024):.1f} KB")
print(f"Total thumbnail storage: {(total_thumb_bytes / (1024*1024)):.2f} MB")

