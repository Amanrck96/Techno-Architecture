import re

with open('scratch/drive_page.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all tooltips and strings
tooltips = set(re.findall(r'data-tooltip="([^"]+)"', text))
print("Sample tooltips:", list(tooltips)[:20])

# Find any names or owners
owners = set(re.findall(r'aria-label="([^"]+)"', text))
interesting = [o for o in owners if any(k in o.lower() for k in ['shared', 'owner', 'created', 'by', 'techno', 'team'])]
print("\nInteresting aria-labels (first 10):", interesting[:10])
