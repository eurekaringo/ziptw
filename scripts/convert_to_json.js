const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function convertExcelToJson() {
  try {
    // 定義檔案路徑
    const baseDir = path.resolve(__dirname, '..');
    const excelFile = path.join(baseDir, '郵遞區號資料', '中英文街路名稱對照檔1130401.xls');
    const outputFile = path.join(baseDir, 'public', 'data', 'zipcode.json');
    
    console.log('📁 檢查檔案路徑:');
    console.log('Excel 檔案:', excelFile);
    console.log('輸出檔案:', outputFile);
    
    // 檢查輸入檔案是否存在
    if (!fs.existsSync(excelFile)) {
      throw new Error(`Excel 檔案不存在: ${excelFile}`);
    }
    
    // 確保輸出目錄存在
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      console.log('📁 建立輸出目錄:', outputDir);
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 讀取 Excel 檔案
    console.log('📖 讀取 Excel 檔案...');
    const workbook = xlsx.readFile(excelFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 轉換成 JSON 格式
    console.log('🔄 轉換資料...');
    const data = xlsx.utils.sheet_to_json(worksheet).map(row => ({
      city: row['縣市'] || '',
      district: row['鄉鎮市區'] || '',
      zipcode: row['郵遞區號'] || '',
      street: row['街路名稱'] || '',
      street_en: row['街路名稱英譯'] || ''
    }));
    
    // 寫入 JSON 檔案
    console.log('💾 寫入 JSON 檔案...');
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('✅ 已成功轉換並儲存至', outputFile);
    console.log(`📊 共轉換 ${data.length} 筆資料`);
  } catch (error) {
    console.error('❌ 轉換失敗:', error.message);
    console.error('錯誤詳情:', error);
  }
}

convertExcelToJson(); 