import fitz
import os

pdf_files = [
    ("114_1_AI_Tech.txt", "114年第二梯次中級AI應用規劃師第一科人工智慧技術應用與規劃(當次試題公告114_20251226000616.pdf"),
    ("114_2_BigData.txt", "114年第二梯次中級AI應用規劃師第二科大數據處理分析與應用(當次試題公告114_20251226000634.pdf"),
    ("114_3_ML.txt", "114年第二梯次中級AI應用規劃師第三科機器學習技術與應用(當次試題公告114_20251226000650.pdf"),
    ("L21_Study_Guide.txt", "L21 人工智慧技術應用與規劃_電子版.pdf"),
    ("L21_Mock_Questions.txt", "《L21 人工智慧技術應用與規劃》模擬題庫_電子版.pdf")
]

output_dir = "extracted_text"
os.makedirs(output_dir, exist_ok=True)

print("開始將 PDF 轉換為 UTF-8 文字檔...")
for txt_name, pdf_name in pdf_files:
    pdf_path = pdf_name
    txt_path = os.path.join(output_dir, txt_name)
    if os.path.exists(pdf_path):
        try:
            print(f"正在處理: {pdf_name} -> {txt_path}")
            doc = fitz.open(pdf_path)
            with open(txt_path, "w", encoding="utf-8") as f:
                for page_num in range(doc.page_count):
                    page = doc[page_num]
                    text = page.get_text()
                    f.write(f"=== PAGE {page_num + 1} ===\n")
                    f.write(text)
                    f.write("\n\n")
            print(f"  成功轉換！頁數: {doc.page_count}")
        except Exception as e:
            print(f"  處理 {pdf_name} 失敗: {e}")
    else:
        print(f"  檔案不存在: {pdf_name}")

print("所有 PDF 處理完成。")
