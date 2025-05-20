import React from 'react';
import { CardWrapper, ZhText, EnText, ButtonRow, CopyButton } from './styles';

interface ResultCardProps {
  zh: string;
  en: string;
  zip: string;
  onCopyZh: () => void;
  onCopyZip: () => void;
  onCopyEn: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ zh, en, zip, onCopyZh, onCopyZip, onCopyEn }) => (
  <CardWrapper>
    <ZhText>{zip} {zh}</ZhText>
    <EnText>{en}</EnText>
    <ButtonRow>
      <CopyButton onClick={onCopyZh}>複製中文資訊</CopyButton>
      <CopyButton onClick={onCopyZip}>只複製郵遞區號</CopyButton>
      <CopyButton onClick={onCopyEn}>只複製英文</CopyButton>
    </ButtonRow>
  </CardWrapper>
); 