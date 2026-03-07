import glob
import os
import re

html_files = glob.glob('src/main/resources/static/*.html')

bell_icon_html = """
        <div class="notification-icon-container" style="position: relative; margin-right: 15px; cursor: pointer; display: flex; align-items: center;">
            <i class="fa-solid fa-bell" style="font-size: 1.2rem; color: #4B5563;"></i>
            <span class="notification-badge" style="position: absolute; top: -5px; right: -8px; background: #EF4444; color: white; display: none; font-size: 0.7rem; padding: 2px 5px; border-radius: 50%; font-weight: bold;">0</span>
        </div>
"""

script_html = '<script src="/js/notification_handler.js"></script>\n</body>'

for filepath in html_files:
    # Don't modify checkout.html or login/register
    if 'checkout.html' in filepath or 'login' in filepath or 'register' in filepath:
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # Insert bell icon before <div class="user-profile"> inside <div class="nav-right">
    if '<div class="user-profile">' in content and bell_icon_html.strip() not in content:
        content = content.replace('<div class="user-profile">', bell_icon_html + '        <div class="user-profile">')
        modified = True

    # Check if we have nav-right but no user-profile (rare, but just in case)
    elif '<div class="nav-right">' in content and bell_icon_html.strip() not in content:
        content = content.replace('<div class="nav-right">', '<div class="nav-right">\n' + bell_icon_html)
        modified = True

    # Insert script before </body>
    if '/js/notification_handler.js' not in content and '</body>' in content:
        content = content.replace('</body>', script_html)
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
