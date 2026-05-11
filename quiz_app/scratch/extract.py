import fitz
import glob
import os

pdf_files = glob.glob('c:/Git-Data/Test/*.pdf')
with open('c:/Git-Data/quiz_app/scratch/roi_question.txt', 'w', encoding='utf-8') as out:
    for f in pdf_files:
        try:
            doc = fitz.open(f)
            for page_num, page in enumerate(doc):
                text = page.get_text()
                if 'ROI' in text or '投資報酬率' in text:
                    out.write(f"\n--- {os.path.basename(f)} ---\n")
                    out.write(f"Page {page_num}:\n")
                    # Split text into lines to only show relevant lines
                    lines = text.split('\n')
                    for i, line in enumerate(lines):
                        if 'ROI' in line or '投資報酬率' in line:
                            start = max(0, i-10)
                            end = min(len(lines), i+10)
                            out.write('\n'.join(lines[start:end]) + '\n')
                            out.write('-'*40 + '\n')
        except Exception as e:
            out.write(f"Error reading {f}: {e}\n")
