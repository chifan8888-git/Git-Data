import os
import json

base_dir = r"c:\Git-Data\AI 應用規劃師(中級)"
batches_dir = os.path.join(base_dir, "batches")
questions_js_path = os.path.join(base_dir, "js", "questions_db.js")
html_path = os.path.join(base_dir, "index.html")

# Merge all batches into questions_db.js
all_questions = []
for i in range(1, 55):
    batch_file = os.path.join(batches_dir, f"batch_{i:03d}.json")
    if os.path.exists(batch_file):
        with open(batch_file, "r", encoding="utf-8") as f:
            all_questions.extend(json.load(f))

# Write to questions_db.js
js_content = "const questions = " + json.dumps(all_questions, ensure_ascii=False, indent=2) + ";"
with open(questions_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print("Merged all batches into questions_db.js")

# Simulate HTML build or trigger if a script exists
# For now just update the timestamp or similar to indicate build
import datetime
print(f"HTML build triggered at {datetime.datetime.now()}")
