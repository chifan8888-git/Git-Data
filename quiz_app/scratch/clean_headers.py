import json
import re

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

count = 0
for q in questions:
    old_q = q['question']
    # The pattern matches the header/footer noise from the PDF
    new_q = re.sub(r'11[45]\s*年.*?第\s*\d+\s*頁，共\s*\d+\s*頁\s*答案\s*題\s*目\s*', '', old_q)
    if old_q != new_q:
        q['question'] = new_q
        count += 1

print(f"Cleaned PDF headers from {count} questions.")

with open('c:/Git-Data/quiz_app/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

with open('c:/Git-Data/quiz_app/questions.json.js', 'w', encoding='utf-8') as f:
    f.write("window.QUIZ_QUESTIONS = ")
    json.dump(questions, f, ensure_ascii=False, indent=2)
    f.write(";\n")
