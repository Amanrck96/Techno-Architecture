import urllib.request
import os

os.makedirs('public/team', exist_ok=True)

test_id = '1sURZ5scJfIhGBHiqvUZQvWMpSpWW96Re' # Rajesh sir.jpg
url = f'https://lh3.googleusercontent.com/d/{test_id}=w1000'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
        print('Downloaded size from lh3:', len(content), 'Content-Type:', resp.headers.get('Content-Type'))
        with open('public/team/rajesh-shivaram.jpg', 'wb') as f:
            f.write(content)
        print('Saved successfully!')
except Exception as e:
    print('lh3 error:', e)
    # try export download
    try:
        url2 = f'https://drive.google.com/uc?export=download&id={test_id}'
        with urllib.request.urlopen(urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})) as resp2:
            content2 = resp2.read()
            print('Downloaded size from uc:', len(content2))
            with open('public/team/rajesh-shivaram.jpg', 'wb') as f:
                f.write(content2)
            print('Saved from uc!')
    except Exception as e2:
        print('uc error:', e2)
