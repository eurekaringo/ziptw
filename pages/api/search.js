import fs from 'fs';
import path from 'path';

async function fetchZip5Fallback(address) {
  try {
    const res = await fetch(`https://zip5.5432.tw/zip5json.py?adrs=${encodeURIComponent(address)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.zipcode || data.zipcode6) {
      return {
        zipcode: data.zipcode,
        zipcode6: data.zipcode6,
        address: data.new_adrs || address,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function generateCombinations(address) {
  // 統一台為臺，去除空白標點
  address = address.replace(/台/g, '臺').replace(/[\s,.-]/g, '');
  const parts = address.match(/(.+?[縣市])(.+?[市區鄉鎮])(.+)/) || address.match(/(.+?[縣市])(.+)/);
  if (!parts) return [address];
  let city, district, rest;
  if (parts.length === 4) {
    [, city, district, rest] = parts;
  } else {
    [, city, rest] = parts;
    district = '';
  }
  return [
    address,
    `${city}${district}${rest?.split('號')[0]}`,
    `${city}${district}${rest?.split('巷')[0]}`,
    `${city}${district}${rest?.split('路')[0]}路`,
    `${city}${district}`,
    `${city}${rest?.split('巷')[0]}`
  ].filter((addr, idx, arr) => addr && arr.indexOf(addr) === idx);
}

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: '缺少查詢參數' });

  const filePath = path.join(process.cwd(), 'public', 'data', 'zipcode.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const zipcodeData = JSON.parse(raw);

  const combos = generateCombinations(q);
  for (const addr of combos) {
    const match = zipcodeData.find(item =>
      addr.includes(item.city) &&
      addr.includes(item.district) &&
      addr.includes(item.street)
    );
    if (match) {
      return res.status(200).json({
        zipcode: match.zipcode,
        address: `${match.city}${match.district}${match.street}`,
        zipcode6: match.zipcode6 || '',
      });
    }
  }
  // fallback to zip5.5432.tw
  for (const addr of combos) {
    const result = await fetchZip5Fallback(addr);
    if (result) {
      return res.status(200).json(result);
    }
  }
  return res.status(404).json({ error: '查無資料' });
} 