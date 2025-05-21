const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '../郵遞區號資料/中英文街路名稱對照檔1130401.xls');
const output = path.join(__dirname, '../public/zipcode.json');

const wb = xlsx.readFile(input);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { defval: '' });

// 假設欄位名稱包含：郵遞區號、縣市、區、路名、英文路名
const result = data.map(row => ({
  zipcode: row['郵遞區號'] || row['郵遞區號(6碼)'] || row['郵遞區號(3碼)'] || '',
  city: row['縣市'] || row['縣市名稱'] || '',
  district: row['區'] || row['鄉鎮市區'] || '',
  road: row['路名'] || row['村里'] || '',
  road_en: row['英文路名'] || row['英文'] || '',
})).filter(item => item.zipcode && item.city);

fs.writeFileSync(output, JSON.stringify(result, null, 2), 'utf8');
console.log(`已產生 ${output}，共 ${result.length} 筆`); 