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

# Clean up full text to make matching easier
# remove newlines inside a paragraph
full_text_clean = re.sub(r'\n+', '\n', full_text)

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Regex to find: number. (question text) (A) (option A text)
# We can just split by "\n(A)" and then match.
# Let's extract questions and their options from PDF
pdf_data = []
matches = re.finditer(r'\n(\d+)\.\s+(.*?)\n\(A\)\s*(.*?)(?=\n\(B\)|$)', full_text_clean, re.DOTALL)
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).replace('\n', '')
    optA = m.group(3).replace('\n', '').strip()
    pdf_data.append({'q_num': q_num, 'q_text': q_text, 'optA': optA})

print(f"Extracted {len(pdf_data)} questions from PDFs.")

success = 0
failed = []

for q in questions:
    opt0_json = q['options'][0].replace(' ', '').replace('　', '')
    best_match = None
    
    for pdf_q in pdf_data:
        optA_pdf = pdf_q['optA'].replace(' ', '').replace('　', '')
        # check if optA_pdf and opt0_json are similar
        if opt0_json[:10] in optA_pdf or optA_pdf[:10] in opt0_json:
            best_match = pdf_q['q_text']
            break
            
    if best_match:
        success += 1
        q['question'] = best_match
    else:
        failed.append(q['id'])

print(f"Matched {success}, Failed {len(failed)}")
if failed:
    print(f"Failed IDs: {failed[:10]}...")

if success == len(questions):
    with open('c:/Git-Data/quiz_app/scratch/fixed_questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print("Saved fixed_questions.json")
