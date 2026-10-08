import glob, re, os

pages = glob.glob('src/app/**/page.tsx', recursive=True)
print(f"Total pages found: {len(pages)}")
for p in sorted(pages):
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check max-w, padding, mx-auto
    paddings = re.findall(r'px-[0-9a-z-]+|p-[0-9a-z-]+|max-w-[0-9a-z\[\]]+', content)
    unique_pad = list(dict.fromkeys(paddings))[:5]
    print(f"{p:40} | {', '.join(unique_pad)}")
