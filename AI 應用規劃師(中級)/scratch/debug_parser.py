import re
import os

filepath = "extracted_text/114_2_BigData.txt"
with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("開始除錯 114_2_BigData.txt 解析程序...")
i = 0
total_lines = len(lines)
parsed_count = 0

while i < total_lines:
    line = lines[i].strip()
    
    if not line or "=== PAGE" in line or "114 年第二次AI 應用規劃師" in line or "試題公告日期" in line or "共" in line and "頁" in line or line == "答案" or line == "題目" or line == "答" or line == "案":
        i += 1
        continue
        
    # 格式 2 檢查
    format2_match = re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)\s*(.*)", line)
    if format2_match:
        ans_char = format2_match.group(1).upper()
        ans_map = {"Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "A": "A", "B": "B", "C": "C", "D": "D"}
        ans = ans_map.get(ans_char, ans_char)
        q_num = int(format2_match.group(2))
        rest_text = format2_match.group(3).strip()
        print(f"  [格式2] 找到第 {q_num} 題，答案 {ans}，開頭: {rest_text[:30]}")
        parsed_count += 1
        
        # 模擬跳過題目與選項
        i += 1
        while i < total_lines:
            next_line = lines[i].strip()
            if not next_line or "=== PAGE" in next_line or "114 年第二次AI 應用規劃師" in next_line:
                i += 1
                continue
            if next_line in ["A", "B", "C", "D"] or re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)", next_line):
                break
            i += 1
        continue
        
    # 格式 1 檢查
    if line in ["A", "B", "C", "D"] and i + 1 < total_lines:
        current_answer = line
        # 尋找下一行非空且非無用資訊的行
        temp_i = i + 1
        next_line = ""
        while temp_i < total_lines:
            next_line = lines[temp_i].strip()
            if next_line and "=== PAGE" not in next_line and "114 年第二次AI 應用規劃師" not in next_line and "試題公告日期" not in next_line and "共" not in next_line:
                break
            temp_i += 1
            
        num_match = re.match(r"^(\d+)\.\s*(.*)", next_line)
        if num_match:
            q_num = int(num_match.group(1))
            q_text = num_match.group(2)
            print(f"  [格式1] 找到第 {q_num} 題，答案 {current_answer}，開合: {q_text[:30]}")
            parsed_count += 1
            i = temp_i + 1
            # 模擬跳過選項
            while i < total_lines:
                next_line = lines[i].strip()
                if not next_line or "=== PAGE" in next_line or "114 年第二次AI 應用規劃師" in next_line:
                    i += 1
                    continue
                if next_line in ["A", "B", "C", "D"] or re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)", next_line):
                    break
                i += 1
            continue
        else:
            print(f"  [警報] 發現答案 {line} (行 {i+1})，但其後的有效行不是題號格式: {next_line[:50]}")
            
    i += 1

print(f"除錯完成，總計找到 {parsed_count} 題。")
