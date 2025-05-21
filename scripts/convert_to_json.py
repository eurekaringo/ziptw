import pandas as pd
import json
import os

def convert_excel_to_json():
    # 定義檔案路徑
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_file = os.path.join(base_dir, '郵遞區號資料', '中英文街路名稱對照檔1130401.xls')
    output_file = os.path.join(base_dir, 'public', 'data', 'zipcode.json')
    
    # 確保輸出目錄存在
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    try:
        # 讀取 Excel 檔案
        df = pd.read_excel(excel_file, dtype=str)
        
        # 轉換成 JSON 格式
        data = []
        for _, row in df.iterrows():
            item = {
                'city': row['縣市'],
                'district': row['鄉鎮市區'],
                'zipcode': row['郵遞區號'],
                'street': row['街路名稱'],
                'street_en': row['街路名稱英譯']
            }
            data.append(item)
        
        # 寫入 JSON 檔案
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f'✅ 已成功轉換並儲存至 {output_file}')
        
    except Exception as e:
        print(f'❌ 轉換失敗: {str(e)}')

if __name__ == '__main__':
    convert_excel_to_json() 