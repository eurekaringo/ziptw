const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ziptw.vercel.app/api';

// 地址預處理函數
function preprocessAddress(address) {
  // 統一「台」為「臺」並移除無效字符
  address = address.replace(/台/g, '臺').replace(/[\s,.-]/g, '');
  // 分割地址（支援縣市、鄉鎮、路名、門牌）
  const parts = address.match(/(.+?[縣市])(.+?[區鄉鎮])(.+)/);
  if (!parts) return [address];
  const [_, city, district, rest] = parts;
  // 生成多種地址組合（去重）
  const combinations = [
    address, // 完整地址
    `${city}${district}${rest.split('號')[0]}`, // 去掉門牌
    `${city}${district}${rest.split('巷')[0]}`, // 去掉巷弄
    `${city}${district}` // 僅縣市+鄉鎮
  ].filter((addr, index, self) => self.indexOf(addr) === index);
  return combinations;
}

// 查詢郵遞區號
export const searchAddress = async (term) => {
  const addresses = preprocessAddress(term);
  for (const addr of addresses) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(addr)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`搜尋失敗，狀態碼: ${response.status}`);
      }
      const data = await response.json();
      // 假設 API 回應格式為 { zipcode: "10051", zipcode6: "100001", address: "..." }
      if (data.zipcode || data.zipcode6) {
        return {
          input_address: addr,
          zipcode_3_2: data.zipcode || 'N/A',
          zipcode_3_3: data.zipcode6 || 'N/A',
          returned_address: data.address || addr,
        };
      }
    } catch (error) {
      console.error(`搜尋地址失敗 (${addr}):`, error.message);
    }
  }
  throw new Error('查詢不到郵遞區號，請檢查地址格式或 API 服務');
};

// 獲取地址建議
export const getSuggestions = async (term) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suggestions?q=${encodeURIComponent(term)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`取得建議失敗，狀態碼: ${response.status}`);
    }
    const data = await response.json();
    // 假設回應格式為 { suggestions: ["地址1", "地址2", ...] }
    return data.suggestions || [];
  } catch (error) {
    console.error('取得建議時發生錯誤:', error.message);
    return [];
  }
}; 