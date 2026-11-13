import subprocess
import os
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
src_video = "public/brindavan.mp4"
dst_video = "public/brindavan_hero.mp4"

# If public/brindavan.mp4 was overwritten or needs restore, check size
if not os.path.exists(src_video) or os.path.getsize(src_video) < 50_000_000:
    print("Restoring original brindavan.mp4 from git...")
    subprocess.run(["git", "checkout", "3c97641a3f7f3d98b5f04d6a6cfb2ce241ab82d6~1", "--", "public/brindavan.mp4"], check=True)

print("Original size:", os.path.getsize(src_video) / (1024 * 1024), "MB")

# Encode with H.264, 720p (1280x720), CRF 26, faststart, no audio for ambient loop
cmd = [
    ffmpeg_exe,
    "-y",
    "-i", src_video,
    "-vf", "scale=1280:720",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.0",
    "-pix_fmt", "yuv420p",
    "-crf", "26",
    "-preset", "slow",
    "-movflags", "+faststart",
    "-an", # Remove audio track for web ambient loop (saves bandwidth, guarantees autoplay)
    dst_video
]

print("Running ffmpeg command:", " ".join(cmd))
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print("FFMPEG ERROR:", result.stderr)
else:
    new_size = os.path.getsize(dst_video) / (1024 * 1024)
    print(f"✅ Success! Web-optimized video created: {dst_video}")
    print(f"   Original Size: {os.path.getsize(src_video) / (1024 * 1024):.2f} MB")
    print(f"   Optimized Size: {new_size:.2f} MB ({100 - (new_size / (os.path.getsize(src_video) / (1024 * 1024)) * 100):.1f}% reduction!)")

