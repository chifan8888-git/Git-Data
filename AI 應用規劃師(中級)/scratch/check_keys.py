import re

with open('c:/Git-Data/AI 應用規劃師(中級)/js/questions_db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 尋找所有一級的 key，形式為 "key": [ 或 "key": {
keys = re.findall(r'^\s*"(\w+)"\s*:\s*\[', content, re.MULTILINE)
print("Keys in QUESTIONS_DATABASE:", keys)

# 順便看看每個 key 裡面的題目數量
for key in keys:
    # 尋找該 key 的陣列，簡化計數 "id":
    pattern = rf'"{key}"\s*:\s*\[(.*?)\]'
    # 由於檔案很大，我們可以直接統計 "id": 或者是 "difficulty" 出現的次數
    # 尋找該 block 的起點到下一個鍵的起點
    start_idx = content.find(f'"{key}":')
    # 找到下一個 key
    next_keys = [content.find(f'"{k}":') for k in keys if content.find(f'"{k}":') > start_idx]
    end_idx = min(next_keys) if next_keys else len(content)
    block = content[start_idx:end_idx]
    q_count = block.count('"id":')
    print(f"Key: {key}, Question Count: {q_count}")
