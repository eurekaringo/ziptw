import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { message, Modal } from 'antd';
import Tesseract from 'tesseract.js';

// ===== Styled Components 根據設計稿 =====
const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', 'Noto Sans TC', Arial, sans-serif;
`;
const CenterBox = styled.div`
  width: 1179px;
  left: 371px;
  top: 372px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
`;
const TitleBox = styled.div`
  width: 599px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const MainTitle = styled.div`
  align-self: stretch;
  text-align: center;
  color: #4285F4;
  font-size: 60px;
  font-family: Inter, sans-serif;
  font-weight: 900;
  word-break: break-word;
`;
const SubTitle = styled.div`
  align-self: stretch;
  color: #4285F4;
  font-size: 60px;
  font-family: Inter, sans-serif;
  font-weight: 600;
  word-break: break-word;
`;
const SearchArea = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;
const SearchBarBox = styled.div`
  align-self: stretch;
  height: 80px;
  padding: 20px 40px;
  background: #F6F6F6;
  border-radius: 100px;
  outline: 1px #4D83EA solid;
  outline-offset: -1px;
  display: flex;
  align-items: center;
  gap: 60px;
`;
const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 28px;
  color: #474747;
  font-family: Inter, sans-serif;
  font-weight: 500;
  outline: none;
  &::placeholder {
    color: #929292;
    font-weight: 500;
  }
`;
const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
`;
const Desc = styled.div`
  align-self: stretch;
  text-align: center;
  color: #868686;
  font-size: 24px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  word-break: break-word;
`;
const FooterBar = styled.div`
  width: 1920px;
  height: 48px;
  padding: 0 21px;
  left: 0;
  bottom: 0;
  position: absolute;
  background: #F6F6F6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #868686;
  font-size: 18px;
`;

// ====== 主功能區狀態與邏輯 ======
export default function Home() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef();

  // 查詢功能（僅示意，請根據實際API或資料庫替換）
  const doSearch = (inputValue) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setTimeout(() => {
      if (!inputValue) {
        setError('請輸入地址關鍵字');
        setLoading(false);
        return;
      }
      // 假資料
      setResult({ city: '台北市', district: '中正區', zipcode: '100' });
      setLoading(false);
    }, 800);
  };

  // 複製功能
  const handleCopy = () => {
    if (result) {
      const text = `${result.city}${result.district} ${result.zipcode}`;
      navigator.clipboard.writeText(text)
        .then(() => { message.success('已複製到剪貼簿'); })
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
    <PageWrapper>
      <CenterBox style={{top: '20%'}}>
        <TitleBox>
          <MainTitle>ZIPTW </MainTitle>
          <SubTitle>3+3台灣郵遞區號查詢</SubTitle>
        </TitleBox>
        <SearchArea>
          <SearchBarBox>
            <SearchInput
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="想找什麼地址？打字拍照都可以"
              disabled={loading || ocrLoading}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(address); }}
            />
            <IconGroup>
              <IconBtn aria-label="拍照" onClick={handleCameraClick}>
                <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="1.39" y="1.1" width="37.51" height="34.18" fill="#696969"/></svg>
              </IconBtn>
              <IconBtn aria-label="語音" onClick={() => message.info('語音功能開發中') }>
                <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="7.9" y="3.14" width="24.2" height="32.36" fill="#696969"/></svg>
              </IconBtn>
              <IconBtn aria-label="搜尋" onClick={() => doSearch(address)}>
                <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="4.74" y="4.78" width="30.51" height="30.5" fill="#696969"/></svg>
              </IconBtn>
            </IconGroup>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              capture="environment"
              onChange={handleFileChange}
            />
          </SearchBarBox>
          <Desc>受夠郵局官網的分段輸入了嗎？快來試試吧！打英文嘛ok！</Desc>
        </SearchArea>
        {error && <div style={{ color: '#e53935', fontSize: 20, marginTop: 8 }}>{error}</div>}
        {result && (
          <div style={{ marginTop: 24, background: '#F6F6F6', borderRadius: 16, padding: 32, minWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 32, color: '#4285F4', fontWeight: 700 }}>{result.city} {result.district}</div>
            <div style={{ fontSize: 24, color: '#868686', margin: '12px 0' }}>郵遞區號：<span style={{ color: '#4285F4', fontWeight: 700 }}>{result.zipcode}</span></div>
            <button onClick={handleCopy} style={{ marginTop: 12, background: '#4285F4', color: 'white', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 20, fontWeight: 600, cursor: 'pointer' }}>複製郵遞區號</button>
          </div>
        )}
      </CenterBox>
      <FooterBar>© 2024 ZIPTW 郵遞區號查詢</FooterBar>
      <Modal
        title="隱私權同意"
        open={privacyVisible}
        onOk={handlePrivacyOk}
        onCancel={() => setPrivacyVisible(false)}
        okText="同意並啟用相機"
        cancelText="取消"
        mask={false}
        centered
      >
        <p>本功能僅用於即時辨識地址，圖片不會上傳或儲存。請確認您同意使用相機進行辨識。</p>
      </Modal>
    </PageWrapper>
  );
} 