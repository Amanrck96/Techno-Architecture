import urllib.request
import os
import re

files_info = [
    ('1_85hT_8GEZY-E0VojHUpEUkanfEscmEk', 'aditya-1.jpg'),
    ('10cXP5HttqFThwQ15e25eb5_WTZ5Tjtz6', 'aditya-2.jpg'),
    ('1kCPGqTnq3oxi0A1VbUDEyWAnTplbXTIG', 'anoop-1.jpg'),
    ('1WTr27m6D9ny1DGR9ok3UwyL67k7HtgMM', 'anoop-2.jpg'),
    ('1vvzMfaad8gAhoHeQUV_CJecmZboBEhAG', 'apeksh-1.jpg'),
    ('1WPmeZaSvKjDw1W9p47YPDvKre5fEPWgy', 'apeksh-2.jpg'),
    ('1Za3x2CgsLOMiZXBO0V7GjECUDzf1KeA4', 'bipin-1.jpg'),
    ('1_4Avq_AbW5S8Ih2qNNsSlhYKKSxGJkug', 'bipin-2.jpg'),
    ('1XpccDlKeRDq63d1xmXo3VBmuzFrcpLZm', 'chaya-1.jpg'),
    ('13oBs4xcFpA-RpspCtLWGyUrWXIC2r9Jl', 'chaya-2.jpg'),
    ('1ti7t8COw-chMs48s-ncMHrqNKPtjHB6P', 'darshan-1.jpg'),
    ('1jF-1ItKpl62HiRq71qMEO94mjFGQm7BJ', 'darshan-2.jpg'),
    ('1SbBLXjWaDAhaZkl57m-J_N1gZMuf73zw', 'dheemanth-1.jpg'),
    ('1iFmiinuEJ_gX-BJy5Z634qiYvXFRMQhs', 'dheemanth-2.jpg'),
    ('1hBC_IAFApKYkEQbvTX3X503NUuuSF0Di', 'harsan-1.jpg'),
    ('1fgMAdZ7wUFchXgbZOuw6qt_nhTfXcm1R', 'harsan-2.jpg'),
    ('1PX1v7WKajpV7bPfCGS8IDlQtoeGvhk7C', 'mohit-1.jpg'),
    ('136TI0MBu206UsdFPkZgDssn4NImuI-Pv', 'mohit-2.jpg'),
    ('1J16oq5AF007GyRGtOU1Zh_rmcmwKKclA', 'nikhil-1.jpg'),
    ('1Bl0mXEX74oMg1vg2O7O2YzoG6ytxIa_4', 'nikhil-2.jpg'),
    ('1HTvBnzYupFlw36KV6VfXZUYGn-s7QFQK', 'padmavathi-1.jpg'),
    ('1Edicuo1tiBexYdNNPEGSlYJniDwCi_av', 'padmavathi-2.jpg'),
    ('1zYwROqHVhEgd19qxtRfTnmmPF9NDW8CB', 'prarthana-1.jpg'),
    ('1hNrlvFSlBnH8enzLJfkcmAwup_8aj8oN', 'prarthana-2.jpg'),
    ('1gD8QkLdJbCI2hG7P8rSkjpnI6LfhMxyh', 'prashant-1.jpg'),
    ('1wU6ySuLzKpjawZseSmAxeiFOcWG54vMP', 'prashant-2.jpg'),
    ('1ZTfegWBSuITASADWjo-R3UsRN5o0BvSU', 'rajesh-copy.jpg'),
    ('1sURZ5scJfIhGBHiqvUZQvWMpSpWW96Re', 'rajesh-shivaram.jpg'),
    ('19cHWNEHwLjOOQlLh3HHbcwVBuusy4uGM', 'rajvardhan-1.jpg'),
    ('1f9G_ng_Zm0BjSKB658apQt_ZDL60YGHy', 'rajvardhan-2.jpg'),
    ('1RiGDr_1K_hnXN3DV1AHQKYoGr5vS6wfB', 'ritika-1.jpg'),
    ('1gtlRnZUJ5Bns0GdO479zpgnqeqAQrLzH', 'ritika-2.jpg'),
    ('1M8YXKXc0-0W0OhdvuSPi8SRr_8WOvFoh', 'sahana-1.jpg'),
    ('1P2FDFDjYQN_fFCzCvZa1_AbXq2oaFecq', 'sahana-2.jpg'),
    ('1GIIlAXTIFoR7reJSHJLOvucQzmVZkEU6', 'sanjana-1.jpg'),
    ('1kpxtPP1rDkQ5JvNmhlzvINlYQSae90fb', 'sanjana-2.jpg'),
    ('1lu1JrERVwfSIEFaPEqDTUU8m7fR7cTU9', 'sujay-1.jpg'),
    ('1QsnKOegqRgWYucCHvUAvMgNe6b2xVDKO', 'sujay-2.jpg'),
    ('19-l-cyfe4EKEd2zN4aa0u-WgTyfnN7Lm', 'suma-1.jpg'),
    ('1IF0_ijipwm4u2it0DOzr0Ikery02LvbJ', 'suma-2.jpg'),
    ('1Y5c-M_q7JOon0g_a7NRZ-8yPru5rp7RH', 'vaishnavi.jpg'),
    ('1elPuvggPNcBfcgwkURSjMTIKgx9HHZs0', 'varun-1.jpg'),
    ('1FVd-oL0y-XZ-lCXqG3QpPdGjV_F7lY-y', 'varun-2.jpg'),
    ('19kVPiYh0Vfu16OZsRHrr-VZXe47m_oFm', 'veerendra-1.jpg'),
    ('1o8QW8Pn0-nRR481DdMNbboHjnH40v2_J', 'veerendra-2.jpg'),
]

os.makedirs('public/team', exist_ok=True)

success_count = 0
failed = []

for file_id, filename in files_info:
    dest = os.path.join('public/team', filename)
    url = f'https://lh3.googleusercontent.com/d/{file_id}=w1000'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(dest, 'wb') as f:
                    f.write(data)
                print(f"Downloaded {filename}: {len(data)} bytes")
                success_count += 1
            else:
                print(f"Warning: {filename} was too small ({len(data)} bytes)")
                failed.append((filename, 'too small'))
    except Exception as e:
        print(f"Failed {filename}: {e}")
        failed.append((filename, str(e)))

print(f"\nDone! Downloaded {success_count}/{len(files_info)} files. Failed: {len(failed)}")
