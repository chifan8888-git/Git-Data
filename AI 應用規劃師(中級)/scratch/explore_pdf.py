import fitz
import os
import json

pdf_files = [
    "114年第二梯次中級AI應用規劃師第一科人工智慧技術應用與規劃(當次試題公告114_20251226000616.pdf",
    "114年第二梯次中級AI應用規劃師第二科大數據處理分析與應用(當次試題公告114_20251226000634.pdf",
    "114年第二梯次中級AI應用規劃師第三科機器學習技術與應用(當次試題公告114_20251226000650.pdf",
    "L21 人工智慧技術應用與規劃_電子版.pdf",
    "《L21 人工智慧技術應用與規劃》模擬題庫_電子版.pdf"
]

print("開始探索 PDF 檔案...")
for pdf in pdf_files:
    if os.path.exists(pdf):
        try:
            doc = fitz.open(pdf)
            print(f"檔案: {pdf}")
            print(f"  頁數: {doc.page_count}")
            # 讀取前 2 頁的文字片段來了解結構
            print("  前兩頁文字預覽:")
            for i in range(min(2, doc.page_count)):
                text = doc[i].get_text()
                lines = text.split('\n')
                preview = "\\n".join(lines[:10])
                print(f"    --- 第 {i+1} 頁 ---")
                print(f"    {preview[:500]}...")
            print("-" * 50)
        except Exception as e:
            print(f"讀取 {pdf} 失敗: {e}")
    else:
        print(f"檔案不存在: {pdf}")
