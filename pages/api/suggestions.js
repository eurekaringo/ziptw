import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: '缺少查詢參數' });

  const filePath = path.join(process.cwd(), 'public', 'data', 'zipcode.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const zipcodeData = JSON.parse(raw);

  const keyword = q.replace(/台/g, '臺').replace(/[\s,.-]/g, '');
  const suggestions = zipcodeData
    .filter(item =>
      item.city.includes(keyword) ||
      item.district.includes(keyword) ||
      item.street.includes(keyword)
    )
    .slice(0, 10)
    .map(item => `${item.city}${item.district}${item.street}`);

  return res.status(200).json({ suggestions });
} 