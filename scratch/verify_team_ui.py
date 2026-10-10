import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1400,1200')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/about')
    time.sleep(2)
    driver.execute_script("document.getElementById('team').scrollIntoView();")
    time.sleep(1)
    driver.save_screenshot('scratch/team_section_about.png')
    print('Screenshot saved: scratch/team_section_about.png')

    # Also capture practitioners cards
    cards_count = driver.execute_script("return document.querySelectorAll('#team .grid > div').length;")
    print('Rendered practitioner cards count on /about:', cards_count)
finally:
    driver.quit()
