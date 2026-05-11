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

# remove newlines completely to allow regex match across lines
full_text_clean = full_text.replace('\n', '')

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

failed_ids = [74, 87, 90, 96, 98, 11404052, 10000053]

with open('c:/Git-Data/quiz_app/scratch/failed_questions_pdf_text.txt', 'w', encoding='utf-8') as out:
    for q in questions:
        if q['id'] in failed_ids:
            out.write(f"\n==== ID {q['id']} ====\n")
            out.write(f"JSON Q: {q['question']}\n")
            out.write(f"Options: {q['options']}\n")
            
            # try finding option 1 or 2
            for opt in q['options']:
                search_str = opt[:10]
                if len(search_str) < 5: continue
                # find context around this option in PDF text
                match = re.search(r'(.{0,150})' + re.escape(search_str) + r'(.{0,150})', full_text_clean)
                if match:
                    out.write(f"PDF Context:\n{match.group(0)}\n")
                    break
