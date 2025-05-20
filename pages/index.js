import React, { useState, useEffect, useRef } from 'react';
import { Input, Card, Typography, Space, Descriptions, Alert, Button, message, AutoComplete, Modal, Dropdown, Menu } from 'antd';
import { CopyOutlined, CameraOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import Tesseract from 'tesseract.js';

const { Title } = Typography;

// 小型郵遞區號測試資料（可擴充）
const zipcodeDB = [
  // ... existing code ...
];

const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
];

const districts = [
  // ... existing code ...
];

// 標準順序解析
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

// 強化模糊解析：不管順序，找出縣市、區名
function fuzzyParseAddress(address) {
  let foundCity = '';
  let foundDistrict = '';
  // 找縣市
  for (const city of cities) {
    if (address.includes(city)) {
      foundCity = city;
      break;
    }
  }
  // 找區名
  for (const district of districts) {
    if (address.includes(district)) {
      foundDistrict = district;
      break;
    }
  }
  // 組合建議
  if (foundCity && foundDistrict) {
    // 取得剩下的路名
    let road = address.replace(foundCity, '').replace(foundDistrict, '');
    return {
      city: foundCity,
      district: foundDistrict,
      road: road.trim(),
    };
  }
  return null;
}

// 查詢郵遞區號
function getZipcode(city, district) {
  const found = zipcodeDB.find(z => z.city === city && z.district === district);
  return found ? found.zipcode : '';
}

const LANGS = [
  { key: 'zh-TW', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
];

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
  const [lang, setLang] = useState('zh-TW');

  // 多語字典（僅示意，實際可擴充）
  const dict = {
    'zh-TW': {
      title: '中華郵政郵遞區號查詢助手',
      search: '查詢',
      inputPlaceholder: '請輸入完整地址或區名',
      photo: '拍照輸入',
      privacyTitle: '隱私權同意',
      privacyText: '本功能僅用於即時辨識地址，圖片不會上傳或儲存。請確認您同意使用相機進行辨識。',
      agree: '同意並啟用相機',
      cancel: '取消',
      notFound: '找不到對應的郵遞區號',
      multi: '有多個結果符合，請選擇：',
      copyZip: '複製郵遞區號',
      copyAddr: '複製地址',
      copyAll: '複製地址+郵遞區號',
    },
    'en': {
      title: 'Taiwan Postal Code Helper',
      search: 'Search',
      inputPlaceholder: 'Enter full address or district',
      photo: 'Photo Input',
      privacyTitle: 'Privacy Consent',
      privacyText: 'This feature is only for instant address recognition. No images will be uploaded or stored. Please confirm your consent to use the camera.',
      agree: 'Agree and Enable Camera',
      cancel: 'Cancel',
      notFound: 'No matching postal code found',
      multi: 'Multiple results found, please select:',
      copyZip: 'Copy Zipcode',
      copyAddr: 'Copy Address',
      copyAll: 'Copy Address + Zipcode',
    },
    'ja': {
      title: '台湾郵便番号検索アシスタント',
      search: '検索',
      inputPlaceholder: '住所または地区名を入力してください',
      photo: '写真入力',
      privacyTitle: 'プライバシー同意',
      privacyText: 'この機能は即時住所認識のみに使用されます。画像はアップロードまたは保存されません。カメラの使用に同意してください。',
      agree: '同意してカメラを有効化',
      cancel: 'キャンセル',
      notFound: '該当する郵便番号が見つかりません',
      multi: '複数の結果が見つかりました。選択してください：',
      copyZip: '郵便番号をコピー',
      copyAddr: '住所をコピー',
      copyAll: '住所+郵便番号をコピー',
    },
  };

  // 產生自動完成建議（不自動查詢）
  const handleInputChange = (value) => {
    setAddress(value);
    setError(null); // 輸入時清空錯誤
    if (!value) {
      setSuggestions([]);
      setResult(null);
      setCandidates([]);
      return;
    }
    // 找所有包含輸入字串的縣市、區、縣市+區
    const keyword = value.trim();
    const matched = zipcodeDB.filter(z =>
      z.city.includes(keyword) ||
      z.district.includes(keyword) ||
      (z.city + z.district).includes(keyword)
    );
    // 只顯示唯一組合
    const unique = Array.from(new Set(matched.map(z => z.city + z.district)))
      .map(str => {
        const z = matched.find(item => item.city + item.district === str);
        return { value: z.city + z.district, label: z.city + z.district };
      });
    setSuggestions(unique);
  };

  // 選擇建議時自動查詢
  const handleSelectSuggestion = (value) => {
    setAddress(value);
    setSuggestions([]);
    doSearch(value);
  };

  // 查詢按鈕才查詢
  const doSearch = (inputValue) => {
    setLoading(true);
    setError(null);
    setCandidates([]);
    setResult(null);
    const value = inputValue.trim();
    if (!value) {
      setLoading(false);
      return;
    }
    // 標準解析
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
    // 模糊搜尋：找所有 city/district/縣市+區 只要有包含輸入字串的
    const matched = zipcodeDB.filter(z =>
      value.includes(z.district) ||
      value.includes(z.city) ||
      (z.city + z.district).includes(value) ||
      (z.district + z.city).includes(value)
    );
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
    // 完全比對不到，進行相似建議（字打錯時）
    function getLevenshtein(a, b) {
      const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
      for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
          );
        }
      }
      return matrix[a.length][b.length];
    }
    const allNames = [
      ...new Set([
        ...zipcodeDB.map(z => z.city),
        ...zipcodeDB.map(z => z.district),
        ...zipcodeDB.map(z => z.city + z.district)
      ])
    ];
    const similar = allNames
      .map(name => ({ name, dist: getLevenshtein(value, name) }))
      .sort((a, b) => a.dist - b.dist)
      .filter(x => x.dist <= 2)
      .slice(0, 3);
    if (similar.length > 0) {
      setError(`找不到完全符合的資料，您是不是要找：${similar.map(x => x.name).join('、')}？`);
      setLoading(false);
      return;
    }
    setError('找不到對應的郵遞區號');
    setLoading(false);
  };

  // 點選候選時自動補全並查詢
  const handleSelectCandidate = (item) => {
    setResult({ city: item.city, district: item.district, road: '', zipcode: item.zipcode });
    setCandidates([]);
    setError(null);
    setAddress(item.city + item.district);
  };

  // 複製功能
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

  // 拍照按鈕觸發
  const handleCameraClick = () => {
    setPrivacyVisible(true);
  };

  // 同意隱私後開啟檔案選擇（相機）
  const handlePrivacyOk = () => {
    setPrivacyVisible(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // OCR 辨識 for input file
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
      {/* 語言切換下拉 */}
      <div className="lang-dropdown">
        <Dropdown
          overlay={<Menu onClick={({ key }) => setLang(key)} items={LANGS} />}
          trigger={['click']}
        >
          <Button>{LANGS.find(l => l.key === lang)?.label}</Button>
        </Dropdown>
      </div>
      <h1>{dict[lang].title}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <AutoComplete
          style={{ flex: 1 }}
          options={suggestions}
          value={address}
          onChange={handleInputChange}
          onSelect={handleSelectSuggestion}
          placeholder={dict[lang].inputPlaceholder}
          filterOption={false}
        >
          <Input.Search
            enterButton={dict[lang].search}
            loading={loading || ocrLoading}
            size="large"
            onSearch={() => doSearch(address)}
          />
        </AutoComplete>
        <Button icon={<CameraOutlined />} size="large" onClick={handleCameraClick} loading={ocrLoading}>
          {dict[lang].photo}
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
      {/* 隱私 popup + blur */}
      {privacyVisible && <div className="popup-blur" />}
      <Modal
        title={dict[lang].privacyTitle}
        open={privacyVisible}
        onOk={handlePrivacyOk}
        onCancel={() => setPrivacyVisible(false)}
        okText={dict[lang].agree}
        cancelText={dict[lang].cancel}
        mask={false}
        centered
      >
        <p>{dict[lang].privacyText}</p>
      </Modal>
      {/* 查詢錯誤訊息顯示在輸入框下方 */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginTop: 8 }}
        />
      )}
      {candidates.length > 1 && (
        <Card style={{ marginTop: 16 }}>
          <p>{dict[lang].multi}</p>
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
            <Button type="primary" onClick={handleCopyZip}>{dict[lang].copyZip}</Button>
            <Button onClick={handleCopyAddress}>{dict[lang].copyAddr}</Button>
            <Button onClick={handleCopyAll}>{dict[lang].copyAll}</Button>
          </Space>
        </Card>
      )}
    </div>
  );
} 