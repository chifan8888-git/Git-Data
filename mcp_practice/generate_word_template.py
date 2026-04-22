import win32com.client
import os
from datetime import datetime

def generate_thesis_template():
    print("=== Word 論文範本自動化生成程式 ===")
    
    try:
        # 1. 啟動 Word
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = True
        doc = word.Documents.Add()
        
        # 取得 Selection 物件以便操作
        sel = word.Selection
        
        # --- Phase 1: 封面 ---
        print("[1/4] 正在產生封面...")
        word.ActiveWindow.View.Type = 3 # 頁面檢視
        
        # 設定置中
        sel.ParagraphFormat.Alignment = 1 # 1 = wdAlignParagraphCenter
        
        # 標題
        sel.Font.Size = 26
        sel.Font.Bold = True
        sel.Font.Name = "微軟正黑體"
        sel.TypeText("碩士論文標題 (範本)\n")
        sel.TypeText("Thesis Title Goes Here\n")
        
        sel.TypeParagraph()
        sel.TypeParagraph()
        
        # 副標題或系所
        sel.Font.Size = 18
        sel.Font.Bold = False
        sel.TypeText("國立 OO 大學 OO 系所\n")
        sel.TypeText("Department of OO, National OO University\n")
        
        # 垂直空間
        for _ in range(8):
            sel.TypeParagraph()
            
        # 作者與日期
        sel.Font.Size = 16
        sel.TypeText("研究生：王小明 (NAME HERE)\n")
        sel.TypeText("指導教授：李教授 (ADVISOR HERE)\n")
        
        sel.TypeParagraph()
        current_date = datetime.now().strftime("%Y 年 %m 月")
        sel.TypeText(f"中華民國 {int(datetime.now().year) - 1911} 年 {datetime.now().month} 月\n")
        sel.TypeText(f"Date: {current_date}\n")
        
        # 換頁
        sel.InsertBreak(7) # 7 = wdPageBreak
        
        # --- Phase 2: 目錄 ---
        print("[2/4] 正在產生目錄欄位...")
        sel.ParagraphFormat.Alignment = 0 # 0 = wdAlignParagraphLeft
        sel.Font.Size = 18
        sel.Font.Bold = True
        sel.TypeText("目錄 (Table of Contents)")
        sel.TypeParagraph()
        
        # 插入目錄欄位 (這是一個特殊的 Word 欄位)
        # 上限為 3 層標題
        doc.TablesOfContents.Add(Range=sel.Range, UseHeadingStyles=True, UpperHeadingLevel=1, LowerHeadingLevel=3)
        
        # 在目錄後換頁
        sel.TypeParagraph()
        sel.InsertBreak(7)
        
        # --- Phase 3: 正文章節 ---
        print("[3/4] 正在配置章節結構...")
        
        chapters = [
            "第 1 章：緒論 (Introduction)",
            "第 2 章：文獻回顧 (Literature Review)",
            "第 3 章：研究方法 (Methodology)",
            "第 4 章：結果與討論 (Results and Discussion)",
            "第 5 章：結論與建議 (Conclusion and Suggestions)",
            "參考文獻 (References)"
        ]
        
        for chapter in chapters:
            # 設定為標題 1 樣式
            sel.Style = doc.Styles("標題 1") # 或 "Heading 1"
            sel.TypeText(chapter)
            sel.TypeParagraph()
            
            # 設定回標準內文樣式
            sel.Style = doc.Styles("內文") # 或 "Normal"
            sel.Font.Size = 12
            sel.Font.Bold = False
            sel.TypeText("請在此處輸入內容。Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n")
            
            # 每個章節分頁 (除了最後一個)
            if chapter != chapters[-1]:
                sel.InsertBreak(7)
                
        # --- Phase 4: 更新目錄與儲存 ---
        print("[4/4] 正在更新目錄功能變數並儲存...")
        
        # 更新所有 Table of Contents
        for toc in doc.TablesOfContents:
            toc.Update()
            
        file_path = os.path.abspath("Thesis_Template.docx")
        doc.SaveAs(file_path)
        
        print(f"\n[SUCCESS] 論文範本已成功生成！")
        print(f"檔案位置：{file_path}")
        
    except Exception as e:
        print(f"[ERROR] 發生錯誤: {e}")
    finally:
        # 我們保持 Word 開啟供使用者查看，所以不執行 word.Quit()
        pass

if __name__ == "__main__":
    generate_thesis_template()
