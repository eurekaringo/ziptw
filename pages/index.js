import React, { useState, useRef } from 'react';
import { Input, Card, Typography, Space, Alert, Button, message, AutoComplete, Modal } from 'antd';
import { CopyOutlined, CameraOutlined } from '@ant-design/icons';
import Tesseract from 'tesseract.js';

const { Title } = Typography;

// 郵遞區號資料庫與工具函式
const zipcodeDB = [
  // ...（完整資料略，請從 src/index.jsx 複製）...
];
const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
];
const districts = [
  // ...（完整資料略，請從 src/index.jsx 複製）...
];
function parseTaiwanAddress(address) {
  const regex = /^(?<city>[^縣市]+[縣市])(?<district>[^鄉鎮市區]+[鄉鎮市區])?(?<road>.+)?$/;
  const match = address.match(regex);
  if (!match || !match.groups) return null;
  return {
    city: match.groups.city || '',
    district: match.groups.district || '',
    road: match.groups.road || '',
  };
}
function fuzzyParseAddress(address) {
  let foundCity = '';
  let foundDistrict = '';
  for (const city of cities) {
    if (address.includes(city)) {
      foundCity = city;
      break;
    }
  }
  for (const district of districts) {
    if (address.includes(district)) {
      foundDistrict = district;
      break;
    }
  }
  if (foundCity && foundDistrict) {
    let road = address.replace(foundCity, '').replace(foundDistrict, '');
    return {
      city: foundCity,
      district: foundDistrict,
      road: road.trim(),
    };
  }
  return null;
}
function getZipcode(city, district) {
  const found = zipcodeDB.find(z => z.city === city && z.district === district);
  return found ? found.zipcode : '';
}

// 英文地名對照表（可擴充）
const en2zh = {
  'Taipei City': '台北市',
  'Xinyi District': '信義區',
  'New Taipei City': '新北市',
  'Banqiao District': '板橋區',
  'Taichung City': '台中市',
  'Taoyuan City': '桃園市',
  'Tainan City': '台南市',
  'Kaohsiung City': '高雄市',
  // ...可依需求擴充...
};
function enAddressToZh(address) {
  let zh = address;
  // 依照英文地名長度排序，避免短詞先被取代
  const sorted = Object.entries(en2zh).sort((a, b) => b[0].length - a[0].length);
  sorted.forEach(([en, zhName]) => {
    zh = zh.replace(new RegExp(en, 'gi'), zhName);
  });
  return zh;
}

// --- 主頁元件 ---
export default function Home() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorSuggest, setErrorSuggest] = useState('');

  // 產生自動完成建議並即時查詢
  const handleInputChange = (value) => {
    setAddress(value);
    if (!value) {
      setSuggestions([]);
      setResult(null);
      setError(null);
      setCandidates([]);
      return;
    }
    const keyword = value.trim();
    const matched = zipcodeDB.filter(z =>
      z.city.includes(keyword) ||
      z.district.includes(keyword) ||
      (z.city + z.district).includes(keyword)
    );
    const unique = Array.from(new Set(matched.map(z => z.city + z.district)))
      .map(str => {
        const z = matched.find(item => item.city + item.district === str);
        return { value: z.city + z.district, label: z.city + z.district };
      });
    setSuggestions(unique);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      doSearch(value);
    }, 300);
  };
  const handleSelectSuggestion = (value) => {
    setAddress(value);
    setSuggestions([]);
    doSearch(value);
  };
  const doSearch = (inputValue) => {
    setLoading(true);
    setError(null);
    setCandidates([]);
    setResult(null);
    setErrorModal(false);
    setErrorMsg('');
    setErrorSuggest('');
    let value = inputValue.trim();
    if (!value) {
      setLoading(false);
      return;
    }
    // 嘗試將英文地址轉中文
    value = enAddressToZh(value);
    const parsedAddress = parseTaiwanAddress(value);
    let zipcode = '';
    if (parsedAddress && parsedAddress.city && parsedAddress.district) {
      zipcode = getZipcode(parsedAddress.city, parsedAddress.district);
      if (zipcode) {
        setResult({ ...parsedAddress, zipcode });
        setAddress(parsedAddress.city + parsedAddress.district);
        setLoading(false);
        return;
      }
    }
    const matched = zipcodeDB.filter(z => value.includes(z.district) || value.includes(z.city));
    if (matched.length === 1) {
      setResult({ city: matched[0].city, district: matched[0].district, road: '', zipcode: matched[0].zipcode });
      setAddress(matched[0].city + matched[0].district);
      setLoading(false);
      return;
    } else if (matched.length > 1) {
      setCandidates(matched);
      setResult(null);
      setLoading(false);
      return;
    }
    // 亂碼或無法辨識時彈窗
    setErrorMsg('找不到對應的郵遞區號');
    setErrorSuggest('請輸入範例：台北市信義區松仁路100號 或 Taipei City Xinyi District Songren Rd. 100');
    setErrorModal(true);
    setLoading(false);
  };
  const handleSelectCandidate = (item) => {
    setResult({ city: item.city, district: item.district, road: '', zipcode: item.zipcode });
    setCandidates([]);
    setError(null);
    setAddress(item.city + item.district);
  };
  const handleCopyZip = () => {
    if (result?.zipcode) {
      navigator.clipboard.writeText(result.zipcode)
        .then(() => { message.success('郵遞區號已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };
  const handleCopyAddress = () => {
    if (result) {
      const addr = `${result.city}${result.district}${result.road || ''}`;
      navigator.clipboard.writeText(addr)
        .then(() => { message.success('地址已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };
  const handleCopyAll = () => {
    if (result) {
      const all = `${result.city}${result.district}${result.road || ''}${result.zipcode}`;
      navigator.clipboard.writeText(all)
        .then(() => { message.success('地址+郵遞區號已複製到剪貼簿'); })
        .catch(() => { message.error('複製失敗，請手動複製'); });
    }
  };
  const handleCameraClick = () => {
    setPrivacyVisible(true);
  };
  const handlePrivacyOk = () => {
    setPrivacyVisible(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    setError(null);
    setSuggestions([]);
    setCandidates([]);
    setResult(null);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng+chi_tra');
      setAddress(text.replace(/\s/g, ''));
      message.success('辨識完成，請確認內容！');
    } catch (e) {
      setError('辨識失敗，請重試');
    }
    setOcrLoading(false);
  };

  return (
    <div className="app-container">
      <h1>中華郵政郵遞區號查詢助手</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <AutoComplete
          style={{ flex: 1 }}
          options={suggestions}
          value={address}
          onChange={handleInputChange}
          onSelect={handleSelectSuggestion}
          placeholder="請輸入完整地址或區名"
          filterOption={false}
        >
          <Input.Search
            enterButton="查詢"
            loading={loading || ocrLoading}
            size="large"
            onSearch={() => doSearch(address)}
          />
        </AutoComplete>
        <Button icon={<CameraOutlined />} size="large" onClick={handleCameraClick} loading={ocrLoading}>
          拍照輸入
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          capture="environment"
          onChange={handleFileChange}
        />
      </div>
      <Modal
        title="隱私權同意"
        open={privacyVisible}
        onOk={handlePrivacyOk}
        onCancel={() => setPrivacyVisible(false)}
        okText="同意並啟用相機"
        cancelText="取消"
      >
        <p>本功能僅用於即時辨識地址，圖片不會上傳或儲存。請確認您同意使用相機進行辨識。</p>
      </Modal>
      <Modal
        title="錯誤"
        open={errorModal}
        onOk={() => setErrorModal(false)}
        onCancel={() => setErrorModal(false)}
        okText="知道了"
        cancelText=""
        footer={(_, { OkBtn }) => <Space direction="vertical" style={{ width: '100%' }}><OkBtn /></Space>}
      >
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 8 }}>{errorMsg}</div>
        <div style={{ color: '#888' }}>{errorSuggest}</div>
      </Modal>
      {candidates.length > 1 && (
        <Card style={{ marginTop: 16 }}>
          <p>有多個結果符合，請選擇：</p>
          {candidates.map((item, idx) => (
            <Button key={idx} style={{ margin: 4 }} onClick={() => handleSelectCandidate(item)}>
              {item.city} {item.district}（{item.zipcode}）
            </Button>
          ))}
        </Card>
      )}
      {result && (
        <Card style={{ marginTop: 16 }}>
          <p><strong>縣市：</strong>{result.city}</p>
          <p><strong>區鄉鎮：</strong>{result.district}</p>
          <p><strong>路名：</strong>{result.road}</p>
          <p><strong>郵遞區號：</strong>{result.zipcode}</p>
          <Space>
            <Button type="primary" onClick={handleCopyZip}>複製郵遞區號</Button>
            <Button onClick={handleCopyAddress}>複製地址</Button>
            <Button onClick={handleCopyAll}>複製地址+郵遞區號</Button>
          </Space>
        </Card>
      )}
    </div>
  );
} 