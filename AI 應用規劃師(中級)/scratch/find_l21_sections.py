import re

with open('c:/Git-Data/AI 應用規劃師(中級)/extracted_text/L21_Study_Guide.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# 尋找所有像 L21XXX 的編號與緊跟其後的標題
matches = re.findall(r'(L21\d{3,5})\s*([^\n\r]+)', text)
unique_matches = {}
for code, title in matches:
    title_clean = title.strip()
    if len(title_clean) < 80 and len(title_clean) > 2:
        if code not in unique_matches:
            unique_matches[code] = title_clean

output_lines = []
for code, title in sorted(unique_matches.items()):
    output_lines.append(f"{code}: {title}")

with open('c:/Git-Data/AI 應用規劃師(中級)/scratch/l21_sections_list.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output_lines))

print(f"掃描完成！共找到 {len(unique_matches)} 個單元。結果已寫入 scratch/l21_sections_list.txt")
