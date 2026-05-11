import fitz
import glob
import json
import re

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

# Extract questions from PDFs
pdf_data = []
matches = re.finditer(r'\n(\d+)\.\s+(.*?)\n\(A\)', full_text_clean, re.DOTALL)
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).replace('\n', '')
    pdf_data.append({'q_num': q_num, 'q_text': q_text})

success = 0
failed = []

for q in questions:
    # Use the last 15 chars of the json question to match the end of PDF question
    # remove spaces and punctuation
    def clean_str(s):
        return re.sub(r'[^\w\u4e00-\u9fff]', '', s)
        
    q_end = clean_str(q['question'])[-15:]
    
    best_match = None
    
    for pdf_q in pdf_data:
        pdf_q_clean = clean_str(pdf_q['q_text'])
        if q_end in pdf_q_clean:
            best_match = pdf_q['q_text']
            break
            
    if best_match:
        success += 1
        q['question'] = best_match
    else:
        # Fallback to option A matching if question matching failed
        opt0_json = clean_str(q['options'][0])[:15]
        # We need to extract optA for fallback
        # Let's just do it simple
        failed.append(q['id'])

print(f"Matched {success}, Failed {len(failed)}")
if failed:
    print(f"Failed IDs: {failed[:10]}")

if success == len(questions):
    with open('c:/Git-Data/quiz_app/scratch/fixed_questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    # Also update questions.json.js
    with open('c:/Git-Data/quiz_app/scratch/fixed_questions.json.js', 'w', encoding='utf-8') as f:
        f.write("const questionsData = ")
        json.dump(questions, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print("Saved fixed_questions.json and fixed_questions.json.js")
