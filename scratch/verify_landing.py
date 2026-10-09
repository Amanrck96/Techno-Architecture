import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1400,1000')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3010/')
    time.sleep(2)

    res = driver.execute_script("""
        const header = document.querySelector('header');
        if (!header) return { error: 'no header' };
        const img = header.querySelector('img[alt="Techno Architecture"]');
        const svg = header.querySelector('svg');
        const text = header.querySelector('svg text');
        
        return {
            hasHeader: true,
            hasImg: !!img,
            hasSvg: !!svg,
            hasText: !!text,
            textContent: text ? text.textContent.trim() : null,
            textLength: text ? text.getAttribute('textLength') : null,
            imgRect: img ? img.getBoundingClientRect() : null,
            svgRect: svg ? svg.getBoundingClientRect() : null,
            textRect: text ? text.getBoundingClientRect() : null
        };
    """)
    print('Gallery Page Header:', res)

finally:
    driver.quit()
