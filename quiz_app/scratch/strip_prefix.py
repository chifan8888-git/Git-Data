import json
import re

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

count = 0
for q in questions:
    if re.match(r'^[A-D]\s+', q['question']):
        q['question'] = re.sub(r'^[A-D]\s+', '', q['question'])
        count += 1

print(f"Removed prefix from {count} questions.")

with open('c:/Git-Data/quiz_app/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

with open('c:/Git-Data/quiz_app/questions.json.js', 'w', encoding='utf-8') as f:
    f.write("window.QUIZ_QUESTIONS = ")
    json.dump(questions, f, ensure_ascii=False, indent=2)
    f.write(";\n")
