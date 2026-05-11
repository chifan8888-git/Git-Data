import fitz
import glob
import json
import re

pdf_files = glob.glob('c:/Git-Data/Test/*.pdf')
docs = [fitz.open(f) for f in pdf_files]

with open('c:/Git-Data/quiz_app/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Extract all text blocks from all PDFs
all_blocks = []
for doc in docs:
    for page in doc:
        blocks = page.get_text("blocks")
        # blocks is a list of (x0, y0, x1, y1, text, block_no, block_type)
        for b in blocks:
            if b[6] == 0: # text block
                text = b[4].replace('\n', '')
                all_blocks.append(text)

print(f"Total blocks extracted: {len(all_blocks)}")

# Try to find question 75
q75 = next(q for q in questions if q['id'] == 75)
opt0 = q75['options'][0][:15].replace(' ', '')
print(f"Looking for option: {opt0}")

for i, block in enumerate(all_blocks):
    if opt0 in block.replace(' ', ''):
        print("FOUND OPTION IN BLOCK:", block)
        print("PREVIOUS BLOCK:", all_blocks[i-1])
        print("PREVIOUS PREVIOUS BLOCK:", all_blocks[i-2])
