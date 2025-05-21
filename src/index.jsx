import React, { useState, useEffect, useRef } from 'react';
import { Input, Card, Typography, Space, Descriptions, Alert, Button, message, AutoComplete, Modal } from 'antd';
import { CopyOutlined, CameraOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './ui.css';
import Tesseract from 'tesseract.js';
import { createRoot } from 'react-dom/client';

const { Title } = Typography;

// 郵遞區號資料
const [zipcodeDB, setZipcodeDB] = useState([]);

// 載入郵遞區號資料
useEffect(() => {
  fetch('/data/zipcode.json')
    .then(response => response.json())
    .then(data => {
      setZipcodeDB(data);
    })
    .catch(error => {
      console.error('載入郵遞區號資料失敗:', error);
      message.error('載入郵遞區號資料失敗');
    });
}, []);

const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'
];
const districts = [
  // 台北市
  '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區',
  // 新北市
  '板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '汐止區', '樹林區', '淡水區', '三峽區',
  '林口區', '五股區', '泰山區', '鶯歌區', '八里區', '瑞芳區', '金山區', '萬里區', '石門區', '三芝區', '石碇區', '坪林區',
  '烏來區', '平溪區', '雙溪區', '貢寮區', '深坑區',
  // 桃園市
  '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龜山區', '大園區', '觀音區', '新屋區', '復興區', '龍潭區',
  // 台中市
  '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區',
  '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區',
  '清水區', '大甲區', '外埔區', '大安區',
  // 台南市
  '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區',
  '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區',
  '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區',
  // 高雄市
  '新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區',
  '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區',
  '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區',
  '茂林區', '茄萣區',
  // 基隆市
  '中正區', '七堵區', '暖暖區', '仁愛區', '中山區', '安樂區', '信義區',
  // 新竹市
  '東區', '北區', '香山區',
  // 嘉義市
  '東區', '西區',
  // 新竹縣
  '竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉',
  // 苗栗縣
  '竹南鎮', '頭份市', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮', '苗栗市', '造橋鄉', '頭屋鄉', '公館鄉',
  '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮',
  // 彰化縣
  '彰化市', '芬園鄉', '花壇鄉', '秀水鄉', '鹿港鎮', '福興鄉', '線西鄉', '和美鎮', '伸港鄉', '員林市', '社頭鄉', '永靖鄉',
  '埔心鄉', '溪湖鎮', '大村鄉', '埔鹽鄉', '田中鎮', '北斗鎮', '田尾鄉', '埤頭鄉', '溪州鄉', '竹塘鄉', '二林鎮', '大城鄉',
  '芳苑鄉', '二水鄉',
  // 南投縣
  '南投市', '中寮鄉', '草屯鎮', '國姓鄉', '埔里鎮', '仁愛鄉', '名間鄉', '集集鎮', '水里鄉', '魚池鄉', '信義鄉', '竹山鎮', '鹿谷鄉',
  // 雲林縣
  '斗南鎮', '大埤鄉', '虎尾鎮', '土庫鎮', '褒忠鄉', '東勢鄉', '台西鄉', '崙背鄉', '麥寮鄉', '斗六市', '林內鄉', '古坑鄉',
  '莿桐鄉', '西螺鎮', '二崙鄉', '北港鎮', '水林鄉', '口湖鄉', '四湖鄉', '元長鄉',
  // 嘉義縣
  '番路鄉', '梅山鄉', '竹崎鄉', '阿里山鄉', '中埔鄉', '大埔鄉', '水上鄉', '鹿草鄉', '太保市', '朴子市', '東石鄉', '六腳鄉',
  '新港鄉', '民雄鄉', '大林鎮', '溪口鄉', '義竹鄉', '布袋鎮',
  // 屏東縣
  '屏東市', '三地門鄉', '霧台鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉',
  '萬丹鄉', '潮州鎮', '泰武鄉', '來義鄉', '萬巒鄉', '崁頂鄉', '新埤鄉', '南州鄉', '林邊鄉', '東港鎮', '琉球鄉', '佳冬鄉',
  '新園鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '恆春鎮', '滿州鄉',
  // 宜蘭縣
  '宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉',
  // 花蓮縣
  '花蓮市', '新城鄉', '秀林鄉', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '玉里鎮', '卓溪鄉', '富里鄉',
  // 台東縣
  '台東市', '綠島鄉', '蘭嶼鄉', '延平鄉', '卑南鄉', '鹿野鄉', '關山鎮', '海端鄉', '池上鄉', '東河鄉', '成功鎮', '長濱鄉',
  '太麻里鄉', '金峰鄉', '大武鄉', '達仁鄉',
  // 澎湖縣
  '馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉',
  // 金門縣
  '金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉',
  // 連江縣
  '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
];

// 標準順序解析
function parseTaiwanAddress(address) {
  // 移除空白
  address = address.trim();
  
  // 嘗試從資料庫中尋找完全匹配
  const exactMatch = zipcodeDB.find(item => 
    address.includes(item.city) && 
    address.includes(item.district) && 
    address.includes(item.street)
  );
  
  if (exactMatch) {
    return {
      city: exactMatch.city,
      district: exactMatch.district,
      street: exactMatch.street,
      zipcode: exactMatch.zipcode
    };
  }
  
  // 如果沒有完全匹配，使用模糊匹配
  return fuzzyParseAddress(address);
}

// 強化模糊解析：不管順序，找出縣市、區名
function fuzzyParseAddress(address) {
  // 移除空白
  address = address.trim();
  
  // 初始化結果
  let bestMatch = null;
  let bestScore = 0;
  
  // 遍歷資料庫尋找最佳匹配
  for (const item of zipcodeDB) {
    const score = getLevenshtein(address, item.street);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  
  if (bestMatch) {
    return {
      city: bestMatch.city,
      district: bestMatch.district,
      street: bestMatch.street,
      zipcode: bestMatch.zipcode
    };
  }
  
  return null;
}

// 查詢郵遞區號
function getZipcode(city, district) {
  const found = zipcodeDB.find(z => z.city === city && z.district === district);
  return found ? found.zipcode : '';
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [zipcodeDB, setZipcodeDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const debounceTimer = useRef(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef();

  // 載入郵遞區號資料
  useEffect(() => {
    fetch('/data/zipcode.json')
      .then(response => response.json())
      .then(data => {
        setZipcodeDB(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('載入郵遞區號資料失敗:', error);
        message.error('載入郵遞區號資料失敗');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
    if (!value) {
      setSuggestions([]);
      return;
    }

    // 搜尋建議
    const results = zipcodeDB
      .filter(item => 
        item.city.includes(value) || 
        item.district.includes(value) || 
        item.street.includes(value)
      )
      .slice(0, 10)
      .map(item => ({
        value: `${item.city}${item.district}${item.street}`,
        label: (
          <div>
            <div>{item.city}{item.district}{item.street}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {item.zipcode} - {item.street_en}
            </div>
          </div>
        ),
        data: item
      }));

    setSuggestions(results);
  };

  const handleSelectSuggestion = (value, option) => {
    setInputValue(value);
    setSelectedAddress(option.data);
    setSuggestions([]);
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
        setInputValue(parsedAddress.city + parsedAddress.district);
        setLoading(false);
        return;
      }
    }
    // 模糊搜尋：找所有可能的 city/district 組合
    const matched = zipcodeDB.filter(z => value.includes(z.district) || value.includes(z.city));
    if (matched.length === 1) {
      setResult({ city: matched[0].city, district: matched[0].district, road: '', zipcode: matched[0].zipcode });
      setInputValue(matched[0].city + matched[0].district);
      setLoading(false);
      return;
    } else if (matched.length > 1) {
      setCandidates(matched);
      setResult(null);
      setLoading(false);
      return;
    }
    // 完全比對不到，進行相似建議（字打錯時）
    // 取所有 city/district/縣市+區，計算 Levenshtein 距離
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
    // 取最相近的前 3 筆
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
      .filter(x => x.dist <= 2) // 只顯示距離2以內的
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
    setInputValue(item.city + item.district);
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
    setShowPrivacy(true);
  };

  // 同意隱私後開啟檔案選擇（相機）
  const handlePrivacyOk = () => {
    setShowPrivacy(false);
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
      setInputValue(text.replace(/\s/g, ''));
      message.success('辨識完成，請確認內容！');
    } catch (e) {
      setError('辨識失敗，請重試');
    }
    setOcrLoading(false);
  };

  return (
    <div className="container">
      <Title level={2}>郵遞區號查詢</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <AutoComplete
              style={{ width: '100%' }}
              options={suggestions}
              value={inputValue}
              onChange={handleInputChange}
              onSelect={handleSelectSuggestion}
            >
              <Input.Search
                placeholder="請輸入地址"
                enterButton="查詢"
                size="large"
                loading={loading || ocrLoading}
                onSearch={() => doSearch(inputValue)}
              />
            </AutoComplete>
            
            <Space>
              <Button
                icon={<CameraOutlined />}
                onClick={handleCameraClick}
                loading={ocrLoading}
              >
                拍照辨識
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Space>
          </Space>
        </Card>

        {selectedAddress && (
          <Card>
            <Descriptions title="查詢結果" bordered>
              <Descriptions.Item label="郵遞區號">
                {selectedAddress.zipcode}
              </Descriptions.Item>
              <Descriptions.Item label="縣市">
                {selectedAddress.city}
              </Descriptions.Item>
              <Descriptions.Item label="鄉鎮市區">
                {selectedAddress.district}
              </Descriptions.Item>
              <Descriptions.Item label="街路名稱">
                {selectedAddress.street}
              </Descriptions.Item>
              <Descriptions.Item label="英文地址">
                {selectedAddress.street_en}
              </Descriptions.Item>
            </Descriptions>
            
            <Space style={{ marginTop: 16 }}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(selectedAddress.zipcode);
                  message.success('已複製郵遞區號');
                }}
              >
                複製郵遞區號
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${selectedAddress.city}${selectedAddress.district}${selectedAddress.street}`
                  );
                  message.success('已複製地址');
                }}
              >
                複製地址
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${selectedAddress.zipcode} ${selectedAddress.city}${selectedAddress.district}${selectedAddress.street}`
                  );
                  message.success('已複製完整地址');
                }}
              >
                複製完整地址
              </Button>
            </Space>
          </Card>
        )}

        {error && (
          <Alert
            message="查詢失敗"
            description={error}
            type="error"
            showIcon
          />
        )}
      </Space>

      <Modal
        title="隱私權同意"
        open={showPrivacy}
        onOk={handlePrivacyOk}
        onCancel={() => setShowPrivacy(false)}
        okText="同意並啟用相機"
        cancelText="取消"
      >
        <p>本功能需要存取您的相機，以進行地址辨識。</p>
        <p>所有辨識過程都在您的裝置上進行，不會上傳任何資料。</p>
      </Modal>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
