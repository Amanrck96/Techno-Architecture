import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image
import numpy as np

viewports = [
    ("Desktop (User: 1366x768)", 1366, 768),
    ("Tablet (768x1024)", 768, 1024),
    ("Mobile (375x812)", 375, 812),
]

for name, width, height in viewports:
    print(f"\n==========================================")
    print(f"AUDITING VIEWPORT: {name}")
    print(f"==========================================")
    
    options = Options()
    options.add_argument('--headless')
    options.add_argument(f'--window-size={width},{height}')
    driver = webdriver.Chrome(options=options)
    
    try:
        # Load /home?intro=cinematic
        driver.get('http://localhost:3010/home?intro=cinematic')
        time.sleep(0.7) # Measure during preloader
        
        preloader_data = driver.execute_script("""
            const preloader = document.querySelector('div[role="dialog"]');
            if (!preloader) return { error: 'preloader not found' };
            const img = preloader.querySelector('img[alt="Techno Architecture"]');
            const svg = preloader.querySelector('svg');
            const text = preloader.querySelector('svg text');
            return {
                found: true,
                imgRect: img ? img.getBoundingClientRect() : null,
                svgRect: svg ? svg.getBoundingClientRect() : null,
                textRect: text ? text.getBoundingClientRect() : null,
                textLength: text ? text.getAttribute('textLength') : null,
                x: text ? text.getAttribute('x') : null,
            };
        """)
        print("1. PRELOADER LOGO:", preloader_data)
        
        # Wait for preloader to finish and reveal HomeIntro
        time.sleep(2.5)
        
        intro_data = driver.execute_script("""
            const intro = document.querySelector('section#introduction');
            if (!intro) return { error: 'intro not found' };
            const img = intro.querySelector('img[alt="Techno Architecture"]');
            const svg = intro.querySelector('svg');
            const text = intro.querySelector('svg text');
            return {
                found: true,
                imgRect: img ? img.getBoundingClientRect() : null,
                svgRect: svg ? svg.getBoundingClientRect() : null,
                textRect: text ? text.getBoundingClientRect() : null,
                textLength: text ? text.getAttribute('textLength') : null,
                x: text ? text.getAttribute('x') : null,
            };
        """)
        print("2. HOME INTRO LOGO:", intro_data)
        
        # Take high-res screenshot
        safe_name = name.split()[0].lower()
        driver.save_screenshot(f'scratch/audit_{safe_name}.png')
        
    finally:
        driver.quit()
