import urllib.request
import re
import json

url = 'https://drive.google.com/drive/folders/1znPxNbUofyc1HsX7e3Gy18tf6yU417gl'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    print('Fetched HTML length:', len(html))
    with open('scratch/drive_page.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    # Extract file names and IDs
    # Google Drive folder pages usually embed items in JS data structures
    images = set(re.findall(r'[\w\s\.-]+\.(?:jpg|jpeg|png|webp)', html, re.IGNORECASE))
    print('Found image filenames in html:', images)

    # Let's search for drive file IDs (28-44 chars alphanumeric with _ and -)
    # Often in patterns like ["id", "filename.jpg", ...] or [null, "filename", ...]
except Exception as e:
    print('Error:', e)
