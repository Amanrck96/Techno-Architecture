import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image
import numpy as np

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1400,1000')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3010/home')
    time.sleep(3)

    driver.save_screenshot('scratch/live_home_full.png')

    res = driver.execute_script("""
        const intro = document.querySelector('section#introduction');
        if (!intro) return { error: 'no intro' };
        const link = intro.querySelector('a[href="/home"]');
        const img = intro.querySelector('img[alt="Techno Architecture"]');
        const svg = intro.querySelector('svg');
        const text = intro.querySelector('svg text');
        
        return {
            hasIntro: true,
            hasImg: !!img,
            hasSvg: !!svg,
            hasText: !!text,
            textContent: text ? text.textContent.trim() : null,
            textLength: text ? text.getAttribute('textLength') : null,
            imgRect: img ? img.getBoundingClientRect() : null,
            svgRect: svg ? svg.getBoundingClientRect() : null,
            textRect: text ? text.getBoundingClientRect() : null,
            char0: (text && text.getExtentOfChar) ? text.getExtentOfChar(0) : null,
            charLast: (text && text.getExtentOfChar) ? text.getExtentOfChar(text.getNumberOfChars() - 1) : null
        };
    """)
    print('DOM Data:', res)

    if res.get('imgRect') and res.get('textRect'):
        ir = res['imgRect']
        tr = res['textRect']
        im = Image.open('scratch/live_home_full.png')
        crop_box = (
            max(0, int(min(ir['left'], tr['left']) - 20)),
            max(0, int(ir['top'] - 20)),
            int(max(ir['right'], tr['right']) + 20),
            int(tr['bottom'] + 30)
        )
        cropped = im.crop(crop_box)
        cropped.save('scratch/live_logo_cropped.png')
        print('Saved cropped screenshot to scratch/live_logo_cropped.png')

finally:
    driver.quit()
