import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1366,768')
driver = webdriver.Chrome(options=options)

try:
    print("Navigating to http://localhost:3010/home?intro=cinematic...")
    driver.get('http://localhost:3010/home?intro=cinematic')

    # Snapshot 1: During preloader at 0.8s
    time.sleep(0.8)
    driver.save_screenshot('scratch/cinematic_preloader.png')
    print("Saved scratch/cinematic_preloader.png")

    # Snapshot 2: After preloader exit at 3.0s
    time.sleep(2.5)
    driver.save_screenshot('scratch/cinematic_home_intro.png')
    print("Saved scratch/cinematic_home_intro.png")

    # Measure HomeIntro logo on the page
    res = driver.execute_script("""
        const intro = document.querySelector('section#introduction');
        if (!intro) return { error: 'no intro' };
        const img = intro.querySelector('img[alt="Techno Architecture"]');
        const text = intro.querySelector('svg text');
        return {
            hasImg: !!img,
            hasText: !!text,
            imgRect: img ? img.getBoundingClientRect() : null,
            textRect: text ? text.getBoundingClientRect() : null
        };
    """)
    print("HomeIntro measurements:", res)

finally:
    driver.quit()
