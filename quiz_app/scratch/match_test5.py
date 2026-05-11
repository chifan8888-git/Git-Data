import fitz
import glob
import json
import re
from difflib import SequenceMatcher

pdf_files = glob.glob('c:/Git-Data/Test/*.pdf')
full_text = ""
for f in pdf_files:
    try:
        doc = fitz.open(f)
        for page in doc:
            full_text += page.get_text() + "\n"
    except Exception as e:
        pass

full_text_clean = re.sub(r'\n+', '\n', full_text)

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Extract all questions from PDFs
pdf_data = []
matches = re.finditer(r'\n(\d+)\.\s+(.*?)\n\(A\)\s*(.*?)(?=\n\(B\)|$)', full_text_clean, re.DOTALL)
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).replace('\n', '')
    optA = m.group(3).replace('\n', '').strip()
    pdf_data.append({'q_text': q_text, 'optA': optA})

def clean_str(s):
    return re.sub(r'[^\w\u4e00-\u9fff]', '', s)

used_pdf_indices = set()
success = 0

for q in questions:
    best_ratio = 0
    best_idx = -1
    
    q_str = clean_str(q['question'] + q['options'][0] + q['options'][1])
    
    for i, pdf_q in enumerate(pdf_data):
        if i in used_pdf_indices: continue
        
        pdf_str = clean_str(pdf_q['q_text'] + pdf_q['optA'])
        ratio = SequenceMatcher(None, q_str, pdf_str).ratio()
        
        if ratio > best_ratio:
            best_ratio = ratio
            best_idx = i
            
    if best_ratio > 0.3: # reasonably confident
        q['question'] = pdf_data[best_idx]['q_text']
        used_pdf_indices.add(best_idx)
        success += 1

print(f"Matched {success} questions out of {len(questions)}")

# Force saving!
with open('c:/Git-Data/quiz_app/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)
with open('c:/Git-Data/quiz_app/questions.json.js', 'w', encoding='utf-8') as f:
    f.write("const questionsData = ")
    json.dump(questions, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print("Successfully updated questions.json and questions.json.js")
