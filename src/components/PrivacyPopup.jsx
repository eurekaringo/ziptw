import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PopupTitle = styled.h2`
  font-size: 24px;
  color: #474747;
  font-family: Inter, sans-serif;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #929292;
  
  &:hover {
    color: #474747;
  }
`;

const PopupContent = styled.div`
  font-size: 16px;
  color: #474747;
  font-family: Inter, sans-serif;
  line-height: 1.6;
  
  p {
    margin-bottom: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background: #4D83EA;
    color: #FFFFFF;
    border: none;
    
    &:hover {
      background: #2D63C8;
    }
  ` : `
    background: #F6F6F6;
    color: #474747;
    border: none;
    
    &:hover {
      background: #E6E6E6;
    }
  `}
`;

export const PrivacyPopup = ({
  isOpen,
  onClose,
  onAccept,
  onDecline
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <PopupContainer>
        <PopupHeader>
          <PopupTitle>隱私權政策</PopupTitle>
          <CloseButton onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CloseButton>
        </PopupHeader>
        <PopupContent>
          <p>我們非常重視您的隱私權。本隱私權政策說明我們如何收集、使用、揭露、處理及保護您使用我們的郵遞區號查詢服務時所提供的資訊。</p>
          <p>當您使用我們的服務時，我們可能會收集以下資訊：</p>
          <ul>
            <li>您提供的地址資訊</li>
            <li>搜尋歷史記錄</li>
            <li>裝置資訊</li>
            <li>使用時間和頻率</li>
          </ul>
          <p>我們使用這些資訊來：</p>
          <ul>
            <li>提供和改進我們的服務</li>
            <li>分析使用情況</li>
            <li>防止詐騙和濫用</li>
          </ul>
        </PopupContent>
        <ButtonGroup>
          <Button onClick={onDecline}>拒絕</Button>
          <Button $primary onClick={onAccept}>接受</Button>
        </ButtonGroup>
      </PopupContainer>
    </Overlay>
  );
}; 