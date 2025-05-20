const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

export const searchAddress = async (term) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(term)}`);
    if (!response.ok) {
      throw new Error('搜尋失敗');
    }
    return await response.json();
  } catch (error) {
    console.error('搜尋地址時發生錯誤:', error);
    throw error;
  }
};

export const getSuggestions = async (term) => {
  try {
    const response = await fetch(`${API_BASE_URL}/suggestions?q=${encodeURIComponent(term)}`);
    if (!response.ok) {
      throw new Error('取得建議失敗');
    }
    return await response.json();
  } catch (error) {
    console.error('取得建議時發生錯誤:', error);
    throw error;
  }
}; 