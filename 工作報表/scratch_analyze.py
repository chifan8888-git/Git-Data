# -*- coding: utf-8 -*-
import pandas as pd
import sys

# 設定輸出編碼為 utf-8
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'C:/Git-Data/TIPS/桓達 專利 清單總表-20260604.xlsx'
sheet_name = '專利清單'

print(f"正在讀取檔案: {file_path}")
df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

# 寫入前10行到文字檔，方便我們觀察標題結構
with open('excel_header.txt', 'w', encoding='utf-8') as f:
    f.write(f"資料維度: {df.shape}\n")
    for i, row in enumerate(df.head(10).values):
        f.write(f"Row {i}: {list(row)}\n\n")

print("已將前10行寫入 excel_header.txt")
