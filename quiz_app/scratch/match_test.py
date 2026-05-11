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
# remove newlines inside a paragraph, but keep some structure
full_text_clean = re.sub(r'\n+', '\n', full_text)

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

success = 0
failed = 0
fixed_questions = []

for q in questions:
    opt0 = q['options'][0]
    # some options might have A. or (A) at the beginning, but in json they are removed.
    # we take first 10 chars of option 0 to search
    search_str = opt0[:10].strip()
    
    # We will search in the full text for search_str
    # Then we look backwards for "\n25. " or similar question number.
    # Actually, a better way: Just search the PDF text using regex for all questions:
    pass

# Alternative approach: Extract all questions from PDFs directly:
pdf_questions = []
# Match pattern: newline, number, dot, space, (question text), newline, (A)
matches = re.finditer(r'\n(\d+)\.\s+(.*?)\n\(A\)', full_text_clean, re.DOTALL)
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).replace('\n', '')
    pdf_questions.append((q_num, q_text))

print(f"Found {len(pdf_questions)} questions in PDFs via regex.")

# Let's see if we can match them to questions.json
for q in questions:
    q_text_json = q['question']
    # find the best match in pdf_questions
    best_match = None
    for pdf_q in pdf_questions:
        if q_text_json.replace(' ', '')[-10:] in pdf_q[1].replace(' ', ''):
            best_match = pdf_q[1]
            break
    if best_match:
        success += 1
    else:
        failed += 1

print(f"Matched {success}, Failed {failed}")
