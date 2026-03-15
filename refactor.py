import os
import re
import sys

def process_html_files(static_dir):
    css_dir = os.path.join(static_dir, 'css')
    js_dir = os.path.join(static_dir, 'js')
    
    os.makedirs(css_dir, exist_ok=True)
    os.makedirs(js_dir, exist_ok=True)
    
    html_files = [f for f in os.listdir(static_dir) if f.endswith('.html')]
    
    for filename in html_files:
        filepath = os.path.join(static_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        name = os.path.splitext(filename)[0]
        
        # Extract <style>
        style_matches = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
        if style_matches:
            combined_style = "\n".join(style_matches)
            css_filepath = os.path.join(css_dir, f"{name}.css")
            with open(css_filepath, 'w', encoding='utf-8') as f:
                f.write(combined_style.strip() + "\n")
            
            # Replace all <style> blocks with a single link tag
            # We'll replace the first one with the link, and remove the others
            link_tag = f'<link rel="stylesheet" href="css/{name}.css">'
            content = re.sub(r'<style>.*?</style>', link_tag, content, count=1, flags=re.DOTALL)
            content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
            
        # Extract <script> (excluding external scrips like fontawesome if any, though usually script src)
        # We only want <script>...</script> without src attr
        script_matches = re.findall(r'<script>((?!src).)*?</script>', content, re.DOTALL) # this regex is bad, let's just use a better one
        script_matches = re.finditer(r'<script\b[^>]*>(.*?)</script>', content, re.DOTALL)
        
        js_content = []
        for match in script_matches:
            tag_open = match.group(0).split('>', 1)[0]
            if 'src=' not in tag_open:
                js_content.append(match.group(1))
                
        if js_content:
            combined_js = "\n".join(js_content)
            js_filepath = os.path.join(js_dir, f"{name}.js")
            with open(js_filepath, 'w', encoding='utf-8') as f:
                f.write(combined_js.strip() + "\n")
                
            # Replace inline scripts
            # We will regex replace <script>...</script> where src is not present
            # We replace the first match with <script src="js/{name}.js"></script> and remove the rest
            script_tag = f'<script src="js/{name}.js"></script>'
            # Regex to match script tags without src
            pattern = re.compile(r'<script(?![^>]*src=)[^>]*>.*?</script>', re.DOTALL)
            content = pattern.sub(script_tag, content, count=1)
            content = pattern.sub('', content)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print("Files refactored successfully.")

if __name__ == '__main__':
    static_folder = r'c:\Users\VICTUS\OneDrive\Documents\healthconnect\healthconnect\src\main\resources\static'
    process_html_files(static_folder)
