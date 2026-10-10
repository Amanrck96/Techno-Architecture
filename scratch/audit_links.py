import os
import re

routes = set()
for root, dirs, files in os.walk('src/app'):
    if 'page.tsx' in files or 'page.ts' in files:
        rel = os.path.relpath(root, 'src/app').replace('\\', '/')
        if rel == '.':
            routes.add('/')
        else:
            routes.add('/' + rel)

print('Known Next.js routes:')
for r in sorted(routes):
    print(' ', r)

# Now check all Link hrefs in src
link_pattern = re.compile(r'<Link[^>]+href=["\']([^"\']+)["\']')
links_found = []

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            for m in link_pattern.finditer(content):
                href = m.group(1)
                links_found.append((os.path.relpath(path, '.'), href))

print(f"\nTotal Link hrefs found: {len(links_found)}")
issues = []
for file, href in links_found:
    if href.startswith('http') or href.startswith('mailto:') or href.startswith('tel:'):
        continue
    if href.startswith('#'):
        continue
    base_href = href.split('#')[0].split('?')[0]
    if base_href == '':
        continue
    # Handle dynamic routes like /projects/aikya or /services/architectural-design or /blog/...
    matched = False
    if base_href in routes:
        matched = True
    else:
        # Check against dynamic patterns
        for r in routes:
            if '[' in r:
                parts_r = r.split('/')
                parts_h = base_href.split('/')
                if len(parts_r) == len(parts_h):
                    match_dynamic = True
                    for pr, ph in zip(parts_r, parts_h):
                        if not pr.startswith('[') and pr != ph:
                            match_dynamic = False
                            break
                    if match_dynamic:
                        matched = True
                        break
    if not matched:
        issues.append((file, href))

print(f"\nPotential broken links ({len(issues)}):")
for f, h in issues:
    print(f"  {f} -> {h}")
