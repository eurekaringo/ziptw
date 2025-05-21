import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: '缺少查詢參數' });

  // 讀取 JSON 資料
  const filePath = path.join(process.cwd(), 'public', 'data', 'zipcode.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const zipcodeData = JSON.parse(raw);

  // 標準化查詢
  const address = q.replace(/台/g, '臺').replace(/[\s,.-]/g, '');
  // 只比對到街路名稱
  const match = zipcodeData.find(item =>
    address.includes(item.city) &&
    address.includes(item.district) &&
    address.includes(item.street)
  );
  if (match) {
    return res.status(200).json({
      zipcode: match.zipcode,
      address: `${match.city}${match.district}${match.street}`,
      zipcode6: match.zipcode6 || '',
    });
  }
  return res.status(404).json({ error: '查無資料' });
} 