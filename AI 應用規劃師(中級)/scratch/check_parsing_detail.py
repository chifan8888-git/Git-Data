import re
import os

filepath = "extracted_text/114_2_BigData.txt"
with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("開始檢查 114_2_BigData.txt 的行結構...")
for idx, line in enumerate(lines[:100]):
    text = line.strip()
    if text in ["A", "B", "C", "D"]:
        print(f"行 {idx+1}: 偵測到單一答案: {text}")
    elif re.match(r"^(\d+)\.\s*", text):
        print(f"行 {idx+1}: 偵測到題號: {text[:50]}")
    elif re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)", text):
        print(f"行 {idx+1}: 偵測到格式2: {text[:50]}")
