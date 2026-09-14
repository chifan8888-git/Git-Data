# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import sys
from datetime import datetime

# 設定輸出編碼
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'C:/Git-Data/TIPS/桓達 專利 清單總表-20260604.xlsx'
sheet_name = '專利清單'

# 讀取資料，跳過第一行空行，以第二行作為 header
df = pd.read_excel(file_path, sheet_name=sheet_name, skiprows=1)

# 清理欄位名稱
df.columns = [str(c).strip() for c in df.columns]

# 過濾掉「桓達編號」為空的無效行
df_clean = df[df['桓達編號'].notna()].copy()

output = []

def add_log(msg):
    print(msg)
    output.append(msg)

add_log("=== 專利統計分析 (排除空行後，有效專利總數: " + str(len(df_clean)) + " 件) ===")

# 1. 專利狀態統計
status_counts = df_clean['狀態'].value_counts(dropna=False)
add_log("\n[1. 專利狀態分佈]")
for k, v in status_counts.items():
    add_log(f" - {k}: {v} 件 ({v/len(df_clean)*100:.2f}%)")

# 2. 國家分佈統計
country_counts = df_clean['國別'].value_counts(dropna=False)
add_log("\n[2. 國家/地區分佈]")
for k, v in country_counts.items():
    add_log(f" - {k}: {v} 件 ({v/len(df_clean)*100:.2f}%)")

# 3. 專利類別統計
type_counts = df_clean['類別'].value_counts(dropna=False)
add_log("\n[3. 專利類別分佈]")
for k, v in type_counts.items():
    add_log(f" - {k}: {v} 件 ({v/len(df_clean)*100:.2f}%)")

# 4. 專利權人統計
owner_counts = df_clean['專利權人'].value_counts(dropna=False)
add_log("\n[4. 專利權人分佈 (前10名)]")
for k, v in owner_counts.head(10).items():
    add_log(f" - {k}: {v} 件 ({v/len(df_clean)*100:.2f}%)")

# 5. 資料異常稽核
add_log("\n[5. 資料品質與異常稽核]")
# 找出國別欄位有異常文字（非正常國家名稱）的行
# 正常國家名稱可能是：台灣, 大陸, 德國, 美國, 日本, 韓國, 歐洲 等
valid_countries = ['台灣', '大陸', '德國', '美國', '日本', '韓國', '歐洲']
bad_countries = df_clean[~df_clean['國別'].isin(valid_countries)]
add_log(f" - 國別欄位異常或未定義筆數: {len(bad_countries)} 筆")
for idx, row in bad_countries.iterrows():
    add_log(f"   * 桓達編號: {row['桓達編號']} | 國別內容: {row['國別']} | 專利名稱: {row['專利名稱']}")

# 檢查下次繳納日期
add_log("\n[6. 專利維護費下次繳納期限統計]")
# 將下次繳納日期轉換為 datetime 格式，忽略錯誤
df_clean['下次繳納日期_clean'] = pd.to_datetime(df_clean['下次繳納日期'], errors='coerce')
valid_dates = df_clean[df_clean['下次繳納日期_clean'].notna()]
add_log(f" - 已設定下次繳納日期之專利筆數: {len(valid_dates)} 筆")

# 篩選未來的繳費期限
today = datetime(2026, 6, 4) # 當前系統時間是2026年6月4日
future_payments = valid_dates[valid_dates['下次繳納日期_clean'] >= today]
add_log(f" - 未來需繳費專利總數: {len(future_payments)} 筆")

# 接下來一季內 (2026-06-04 到 2026-09-04) 需繳費的專利
q1_deadline = today + pd.Timedelta(days=90)
q1_payments = valid_dates[(valid_dates['下次繳納日期_clean'] >= today) & (valid_dates['下次繳納日期_clean'] <= q1_deadline)]
add_log(f" - 未來 90 天內需繳費之專利筆數: {len(q1_payments)} 筆")
for idx, row in q1_payments.sort_values(by='下次繳納日期_clean').iterrows():
    add_log(f"   * 繳費期限: {row['下次繳納日期_clean'].strftime('%Y-%m-%d')} | 桓達編號: {row['桓達編號']} | 國家: {row['國別']} | 類別: {row['類別']} | 證書號: {row['證書號']} | 名稱: {row['專利名稱']}")

# 6個月內需繳費
h1_deadline = today + pd.Timedelta(days=180)
h1_payments = valid_dates[(valid_dates['下次繳納日期_clean'] >= today) & (valid_dates['下次繳納日期_clean'] <= h1_deadline)]
add_log(f" - 未來 180 天內需繳費之專利筆數: {len(h1_payments)} 筆")

# 7. 申請年份統計 (近15年)
df_clean['申請年'] = pd.to_datetime(df_clean['申請日'], errors='coerce').dt.year
year_counts = df_clean['申請年'].value_counts().sort_index(ascending=False)
add_log("\n[7. 近年專利申請量趨勢 (按申請年)]")
for year, val in year_counts.items():
    add_log(f" - {int(year)} 年: {val} 件")

# 寫入檔案
with open('detailed_analysis_clean.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output))

print("分析完成，結果已寫入 detailed_analysis_clean.txt")
