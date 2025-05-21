#!/usr/bin/env python3
import pandas as pd
import subprocess
import os

# 1. 先定義來源檔案與目標路徑
files = {
    # 街路名稱對照（.xls）
    "street": {
        "src": "中英文街路名稱對照檔1130401.xls",
        "dst": "E:/AUTOFILL/zipcode.csv",
        "engine": "xlrd"        # 需要 xlrd 支援 xls 讀取
    },
    # 村里文字巷對照（.xlsx）
    "village": {
        "src": "村里文字巷中英對照.xlsx",
        "dst": "E:/AUTOFILL/village.csv",
        "engine": "openpyxl"
    },
    # 縣市鄉鎮對照（.ods）
    "county": {
        "src": "county_h_10706_.ods",
        "dst": "E:/AUTOFILL/county.csv",
        "engine": "odf"         # 需要 odfpy 支援 ods 讀取
    }
}

# 確保上游依賴已安裝
# pip install pandas xlrd openpyxl odfpy

for key, conf in files.items():
    src = os.path.join(os.getcwd(), conf["src"])
    dst = conf["dst"]
    engine = conf["engine"]
    
    print(f"► 處理 {conf['src']} → {dst}")
    try:
        df = pd.read_excel(src, dtype=str, engine=engine)
        df.to_csv(dst, index=False, encoding='utf-8-sig')
        print(f"   ✅ 已產生 {dst}")
    except Exception as e:
        print(f"   ❌ 轉檔失敗 ({engine}): {e}")
        # 如果 .ods 失敗，可改用 libreoffice headless 轉檔
        if key == "county":
            print("   → 嘗試用 LibreOffice CLI 轉 …")
            subprocess.run([
                "soffice", "--headless", "--convert-to", "csv",
                src, "--outdir", os.path.dirname(dst)
            ], check=False)
            # 轉完後重新命名
            base = os.path.splitext(os.path.basename(src))[0] + ".csv"
            tmp = os.path.join(os.path.dirname(dst), base)
            if os.path.exists(tmp):
                os.replace(tmp, dst)
                print(f"   ✅ 已用 LibreOffice 轉檔並存為 {dst}")
            else:
                print("   ❌ LibreOffice 轉檔也失敗，請確認環境")

print("所有檔案處理完畢。")
