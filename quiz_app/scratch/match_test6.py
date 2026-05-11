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

pdf_data = []
matches = re.finditer(r'\n(\d+)\.\s+(.*?)\n\(A\)\s*(.*?)(?=\n\(B\)|$)', full_text_clean, re.DOTALL)
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).replace('\n', '')
    optA = m.group(3).replace('\n', '').strip()
    pdf_data.append({'q_text': q_text, 'optA': optA})

def clean_str(s):
    return re.sub(r'[^\w\u4e00-\u9fff]', '', s)

failed_ids = [74, 87, 90, 96, 98, 11404052, 10000053]

for q in questions:
    if q['id'] in failed_ids:
        best_ratio = 0
        best_idx = -1
        
        q_str = clean_str(q['question'] + q['options'][0] + q['options'][1] + q['options'][2] + q['options'][3])
        
        for i, pdf_q in enumerate(pdf_data):
            pdf_str = clean_str(pdf_q['q_text'] + pdf_q['optA'])
            # let's try to match by option B, C, D as well?
            # actually our pdf_data only extracts optA.
            # let's just match against the full text clean
            pass

# Let's extract the full block of text around each match in the pdf_text
for q in questions:
    if q['id'] in failed_ids:
        # Just use the option strings to find it in full_text_clean
        opt1 = clean_str(q['options'][1])
        if len(opt1) < 5: opt1 = clean_str(q['options'][2])
        # Find this string in full_text
        found = False
        for m in re.finditer(r'(.{0,100})' + re.escape(q['options'][1][:10]) + r'(.{0,50})', full_text_clean.replace('\n', '')):
            print(f"ID {q['id']} Match: {m.group(0)}")
            found = True
            break
        if not found:
            print(f"ID {q['id']} NOT FOUND in full text")
