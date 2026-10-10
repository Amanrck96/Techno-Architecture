import re

with open('scratch/drive_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for file patterns
# Pattern often: data-id="<ID>" ... <filename>
pattern1 = re.findall(r'data-id="([a-zA-Z0-9_-]+)"[^>]*>.*?<strong[^>]*>([^<]+)</strong>', html)
print('Pattern 1 matches:', pattern1)

# Pattern in JSON: [[null, "ID"], null, ..., "filename.jpg"]
pattern2 = re.findall(r'\[\[null,"([a-zA-Z0-9_-]+)"\],[^\]]*?"image/jpeg"[^\]]*?\[\[\["([^"]+\.jpg)"', html)
print('Pattern 2 matches:', pattern2)

# Also find Vaishnavi
for m in re.finditer(r'Vaishnavi', html):
    idx = m.start()
    print("Match Vaishnavi around:", html[max(0, idx - 150):min(len(html), idx + 150)])
    print("-" * 50)
