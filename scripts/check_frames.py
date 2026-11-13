import re

with open(r'C:\Users\HP\.gemini\antigravity\brain\d176a7a8-b776-4db4-b160-c8b70e24d37b\.system_generated\steps\703\output.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<frame id="([^"]+)" name="([^"]+)"'
matches = re.findall(pattern, text)

print(f"Total frame matches: {len(matches)}")
for fid, fname in matches:
    if fname.startswith(('01_', '02_', '03_', '04_', '05_', '06_', '07_', '08_', '09_', '10_', '11_', '12_')):
        print(f"{fid} -> {fname}")
