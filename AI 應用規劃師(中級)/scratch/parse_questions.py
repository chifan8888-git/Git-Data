import re
import json
import os

# 初始化資料庫結構
questions_db = {
    "subject1": [], # 科目一歷屆試題 (50 題)
    "subject2": [], # 科目二歷屆試題 (50 題)
    "subject3": [], # 科目三歷屆試題 (50 題)
    "mock_questions": [] # L21 模擬題庫 (科目一，共 500 題)
}

def parse_mock_questions(filepath):
    """解析 L21_Mock_Questions.txt 檔案"""
    if not os.path.exists(filepath):
        print(f"找不到檔案: {filepath}")
        return []
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 依題分割
    # 尋找 【第 X 題】難度：XXX 或 【第X題】
    pattern = r"【第\s*(\d+)\s*題】(?:難度：([⭐\s]+))?\n(.*?)(?=【第\s*\d+\s*題】|=== PAGE|\Z)"
    matches = re.finditer(pattern, content, re.DOTALL)
    
    questions = []
    for match in matches:
        q_id = int(match.group(1))
        difficulty_str = match.group(2) if match.group(2) else ""
        q_content = match.group(3).strip()
        
        # 提取難度顆數
        difficulty = difficulty_str.count("⭐") if difficulty_str else 3
        
        lines = [line.strip() for line in q_content.split("\n") if line.strip()]
        
        question_text = ""
        options = {"A": "", "B": "", "C": "", "D": ""}
        answer = ""
        explanation = ""
        
        state = "question"
        
        for line in lines:
            # 檢查是否為答案
            if "✅" in line or "正確答案" in line:
                ans_match = re.search(r"正確答案[：\s]*([A-D])", line)
                if ans_match:
                    answer = ans_match.group(1)
                state = "explanation"
                exp_match = re.search(r"詳解[：\s]*(.*)", line)
                if exp_match:
                    explanation = exp_match.group(1)
                continue
            
            # 檢查是否為詳解開頭
            if line.startswith("詳解：") or line.startswith("詳解 "):
                explanation = line.replace("詳解：", "").replace("詳解", "").strip()
                state = "explanation"
                continue
                
            # 解析選項
            opt_match = re.match(r"^([A-D])\.\s*(.*)", line)
            if opt_match:
                options[opt_match.group(1)] = opt_match.group(2)
                state = "options"
                continue
            
            opt_parenthesis_match = re.match(r"^\(([A-D])\)\s*(.*)", line)
            if opt_parenthesis_match:
                options[opt_parenthesis_match.group(1)] = opt_parenthesis_match.group(2)
                state = "options"
                continue
                
            # 依狀態填充
            if state == "question":
                if question_text:
                    question_text += "\n" + line
                else:
                    question_text = line
            elif state == "explanation":
                if explanation:
                    explanation += "\n" + line
                else:
                    explanation = line
        
        questions.append({
            "id": f"mock_{q_id}",
            "num": q_id,
            "difficulty": difficulty,
            "question": question_text,
            "options": options,
            "answer": answer,
            "explanation": explanation
        })
        
    print(f"成功解析模擬題庫，共 {len(questions)} 題")
    return questions

def parse_past_paper(filepath, subject_name):
    """解析 114 年歷屆試題"""
    if not os.path.exists(filepath):
        print(f"找不到檔案: {filepath}")
        return []
    
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    parsed_questions = []
    i = 0
    total_lines = len(lines)
    
    ans_map = {"Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "A": "A", "B": "B", "C": "C", "D": "D"}
    
    while i < total_lines:
        line = lines[i].strip()
        
        # 忽略無用行
        if not line or "=== PAGE" in line or "114 年第二次AI 應用規劃師" in line or "試題公告日期" in line or "共" in line and "頁" in line or line in ["答案", "題目", "答", "案"]:
            i += 1
            continue
            
        # 格式 2 檢查 (如 "Ｂ 40 ..." 或 "Ｂ 40. ...")
        # 匹配首字為 A-D/全形 A-D，接著是題號 (1-50)，後面可能有空白或點
        format2_match = re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)(?:\.|\s)?\s*(.*)", line)
        if format2_match:
            ans_char = format2_match.group(1).upper()
            ans = ans_map.get(ans_char, ans_char)
            q_num = int(format2_match.group(2))
            rest_text = format2_match.group(3).strip()
            
            # 收集題目與選項
            q_text = rest_text
            options = {"A": "", "B": "", "C": "", "D": ""}
            
            i += 1
            while i < total_lines:
                next_line = lines[i].strip()
                if not next_line or "=== PAGE" in next_line or "114 年第二次AI 應用規劃師" in next_line or "試題公告日期" in next_line:
                    i += 1
                    continue
                
                # 判斷是否為下一題的開始
                # 情況a：單一 A-D 答案行
                # 情況b：格式2 的題頭
                if next_line in ["A", "B", "C", "D"] or re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)", next_line):
                    break
                    
                # 解析選項
                opt_match = re.match(r"^\(([A-D])\)\s*(.*)", next_line)
                if opt_match:
                    options[opt_match.group(1)] = opt_match.group(2)
                else:
                    if q_text:
                        q_text += "\n" + next_line
                    else:
                        q_text = next_line
                i += 1
                
            parsed_questions.append({
                "id": f"{subject_name}_{q_num}",
                "num": q_num,
                "difficulty": 3,
                "question": q_text,
                "options": options,
                "answer": ans,
                "explanation": f"本題為 114 年第二次中級能力鑑定【{subject_name}】歷屆試題公告考題。"
            })
            continue
            
        # 格式 1 檢查 (答案在題目上一行)
        if line in ["A", "B", "C", "D"] and i + 1 < total_lines:
            current_answer = line
            
            # 尋找接下來的有效行
            temp_i = i + 1
            next_line = ""
            while temp_i < total_lines:
                next_line = lines[temp_i].strip()
                if next_line and "=== PAGE" not in next_line and "114 年第二次AI 應用規劃師" not in next_line and "試題公告日期" not in next_line and "共" not in next_line and next_line not in ["答案", "題目", "答", "案"]:
                    break
                temp_i += 1
                
            # 題號匹配：如 "1. " 或 "10 "
            num_match = re.match(r"^(\d+)(?:\.|\s)\s*(.*)", next_line)
            if num_match:
                q_num = int(num_match.group(1))
                q_text = num_match.group(2)
                options = {"A": "", "B": "", "C": "", "D": ""}
                
                i = temp_i + 1
                while i < total_lines:
                    next_line = lines[i].strip()
                    if not next_line or "=== PAGE" in next_line or "114 年第二次AI 應用規劃師" in next_line or "試題公告日期" in next_line:
                        i += 1
                        continue
                        
                    # 遇到下一題開始
                    if next_line in ["A", "B", "C", "D"] or re.match(r"^([A-D]|[Ａ-Ｄ])\s*(\d+)", next_line):
                        break
                        
                    # 解析選項
                    opt_match = re.match(r"^\(([A-D])\)\s*(.*)", next_line)
                    if opt_match:
                        options[opt_match.group(1)] = opt_match.group(2)
                    else:
                        if q_text:
                            q_text += "\n" + next_line
                        else:
                            q_text = next_line
                    i += 1
                    
                parsed_questions.append({
                    "id": f"{subject_name}_{q_num}",
                    "num": q_num,
                    "difficulty": 3,
                    "question": q_text,
                    "options": options,
                    "answer": current_answer,
                    "explanation": f"本題為 114 年第二次中級能力鑑定【{subject_name}】歷屆試題公告考題。"
                })
                continue
                
        i += 1
        
    # 去除重複，並依題號排序
    unique_questions = {}
    for q in parsed_questions:
        unique_questions[q["num"]] = q
    
    sorted_questions = [unique_questions[k] for k in sorted(unique_questions.keys())]
    print(f"成功解析 {subject_name} 歷屆試題，共 {len(sorted_questions)} 題")
    return sorted_questions

# 執行解析
questions_db["subject1"] = parse_past_paper("extracted_text/114_1_AI_Tech.txt", "subject1")
questions_db["subject2"] = parse_past_paper("extracted_text/114_2_BigData.txt", "subject2")
questions_db["subject3"] = parse_past_paper("extracted_text/114_3_ML.txt", "subject3")
questions_db["mock_questions"] = parse_mock_questions("extracted_text/L21_Mock_Questions.txt")

# 將解析結果儲存為 JavaScript 變數
os.makedirs("js", exist_ok=True)
js_content = f"const QUESTIONS_DATABASE = {json.dumps(questions_db, ensure_ascii=False, indent=2)};"

with open("js/questions_db.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
print("成功寫入 js/questions_db.js 檔案！")
