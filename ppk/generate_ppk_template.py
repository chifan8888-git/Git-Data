import xlsxwriter
import numpy as np

def generate_ppk_template(filename):
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet('Ppk 分析報告')

    # 定義樣式
    header_style = workbook.add_format({
        'bold': True,
        'bg_color': '#4F81BD',
        'font_color': 'white',
        'border': 1,
        'align': 'center',
        'valign': 'vcenter'
    })
    
    title_style = workbook.add_format({
        'bold': True,
        'font_size': 16,
        'font_color': '#1F4E78',
        'align': 'left'
    })

    label_style = workbook.add_format({
        'bold': True,
        'bg_color': '#DCE6F1',
        'border': 1,
        'align': 'left'
    })

    data_style = workbook.add_format({
        'border': 1,
        'align': 'center'
    })

    result_style = workbook.add_format({
        'bold': True,
        'border': 1,
        'align': 'center',
        'bg_color': '#F2F2F2'
    })

    ppk_highlight_style = workbook.add_format({
        'bold': True,
        'border': 1,
        'align': 'center',
        'bg_color': '#FFC000',
        'font_size': 12
    })

    formula_style = workbook.add_format({
        'font_color': '#595959',
        'italic': True,
        'font_size': 9
    })

    # 設定欄寬
    worksheet.set_column('A:A', 5)
    worksheet.set_column('B:B', 15)
    worksheet.set_column('C:C', 15)
    worksheet.set_column('D:D', 15)
    worksheet.set_column('E:E', 20)
    worksheet.set_column('F:F', 15)
    worksheet.set_column('G:G', 15)

    # 標題
    worksheet.write('B2', '製程能力分析報告 (Ppk Analysis)', title_style)

    # 規格設定區
    worksheet.write('B4', '規格設定 (Specification)', label_style)
    worksheet.write('B5', '上限 (USL)', label_style)
    worksheet.write('B6', '目標 (Target)', label_style)
    worksheet.write('B7', '下限 (LSL)', label_style)
    
    # 預設規格值
    worksheet.write('C5', 10.5, data_style)
    worksheet.write('C6', 10.0, data_style)
    worksheet.write('C7', 9.5, data_style)

    # 統計結果區
    worksheet.write('E4', '統計結果 (Results)', label_style)
    worksheet.write('E5', '樣本數 (n)', label_style)
    worksheet.write('E6', '平均值 (Mean)', label_style)
    worksheet.write('E7', '標準差 (StdDev - s)', label_style)
    worksheet.write('E8', '最大值 (Max)', label_style)
    worksheet.write('E9', '最小值 (Min)', label_style)
    worksheet.write('E10', '全距 (Range)', label_style)
    
    # 公式計算 (基於 B14:B113 的數據)
    data_range = 'B14:B113'
    worksheet.write_formula('F5', f'=COUNT({data_range})', result_style)
    worksheet.write_formula('F6', f'=AVERAGE({data_range})', result_style)
    worksheet.write_formula('F7', f'=STDEV.S({data_range})', result_style)
    worksheet.write_formula('F8', f'=MAX({data_range})', result_style)
    worksheet.write_formula('F9', f'=MIN({data_range})', result_style)
    worksheet.write_formula('F10', f'=F8-F9', result_style)

    # Ppk 計算區
    worksheet.write('E12', 'Ppu (Upper)', label_style)
    worksheet.write('E13', 'Ppl (Lower)', label_style)
    worksheet.write('E14', 'Ppk', label_style)
    
    # Ppk 公式
    # Ppu = (USL - Mean) / (3 * s)
    worksheet.write_formula('F12', '=(C5-F6)/(3*F7)', result_style)
    # Ppl = (Mean - LSL) / (3 * s)
    worksheet.write_formula('F13', '=(F6-C7)/(3*F7)', result_style)
    # Ppk = min(Ppu, Ppl)
    worksheet.write_formula('F14', '=MIN(F12,F13)', ppk_highlight_style)

    # 數據輸入區
    worksheet.write('B13', '測量數據 (Data)', header_style)
    
    # 產生一些隨機樣本數據 (Mean=10.02, Std=0.15)
    np.random.seed(42)
    sample_data = np.random.normal(10.02, 0.15, 50)
    for i, val in enumerate(sample_data):
        worksheet.write(13 + i, 1, round(val, 3), data_style)
    
    # 填充其餘空白格
    for i in range(len(sample_data), 100):
        worksheet.write(13 + i, 1, None, data_style)

    # 公式說明區
    worksheet.write('B115', '公式參考 (Formulas):', label_style)
    worksheet.write('B116', 'Ppu = (USL - Average) / (3 * StdDev)', formula_style)
    worksheet.write('B117', 'Ppl = (Average - LSL) / (3 * StdDev)', formula_style)
    worksheet.write('B118', 'Ppk = Min(Ppu, Ppl)', formula_style)
    worksheet.write('B119', '註: StdDev 使用樣本標準差 (STDEV.S)', formula_style)

    # --- 直方圖表計算 (輔助區域 - 隱藏或放置遠處) ---
    # 計算分組間隔
    worksheet.write('H4', '直方圖數據區', header_style)
    # 分組邏輯: 規格範圍 9.5 ~ 10.5, 分 10 個 bin
    bins = [9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6]
    worksheet.write('H5', 'Bin (上限)', label_style)
    worksheet.write('I5', '頻率 (Freq)', label_style)
    
    for i, b in enumerate(bins):
        worksheet.write(5 + i, 7, b, data_style)
        # 統計頻率: 使用 Excel FREQUENCY 函數
        # 需要陣列公式，但在 XlsxWriter 中我們可以展開寫
        # 或者使用 COUNTIFS
        if i == 0:
            worksheet.write_formula(5 + i, 8, f'=COUNTIF({data_range}, "<="&H{6+i})', result_style)
        else:
            worksheet.write_formula(5 + i, 8, f'=COUNTIFS({data_range}, ">"&H{5+i}, {data_range}, "<="&H{6+i})', result_style)

    # --- 建立圖表 ---
    chart = workbook.add_chart({'type': 'column'})

    # 新增數據數列
    chart.add_series({
        'name':       '數據分佈',
        'categories': f'=\'Ppk 分析報告\'!$H$6:$H${5+len(bins)}',
        'values':     f'=\'Ppk 分析報告\'!$I$6:$I${5+len(bins)}',
        'fill':       {'color': '#4F81BD'},
        'border':     {'color': 'white'},
    })

    # 圖表標題與軸標籤
    chart.set_title({'name': '製程能力直方圖 (Histogram)'})
    chart.set_x_axis({'name': '測量值'})
    chart.set_y_axis({'name': '頻率'})
    chart.set_legend({'position': 'none'})

    # 插入圖表 (放在 E16 位置)
    worksheet.insert_chart('E16', chart, {'x_offset': 10, 'y_offset': 10})

    workbook.close()
    print(f"成功產生 Excel 模板: {filename}")

if __name__ == "__main__":
    generate_ppk_template('Ppk_Calculation_Template.xlsx')
