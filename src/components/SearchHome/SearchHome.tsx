import React from 'react';
import { SearchHomeWrapper, Title, SubTitle, SearchBarRow, Desc } from './styles';
import { CameraIcon, MicIcon, SearchIcon } from '../icons';
import tokens from '../../tokens.json';

interface SearchHomeProps {
  value: string;
  onChange: (v: string) => void;
  onCamera: () => void;
  onMic: () => void;
  onSearch: () => void;
  placeholder?: string;
}

export const SearchHome: React.FC<SearchHomeProps> = ({ value, onChange, onCamera, onMic, onSearch, placeholder }) => (
  <SearchHomeWrapper>
    <Title>ZIPTW</Title>
    <SubTitle>3+3台灣郵遞區號查詢</SubTitle>
    <SearchBarRow>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '想找什麼地址？打字拍照都可以'}
        aria-label="搜尋地址"
      />
      <button aria-label="拍照" onClick={onCamera}><CameraIcon /></button>
      <button aria-label="語音" onClick={onMic}><MicIcon /></button>
      <button aria-label="搜尋" onClick={onSearch}><SearchIcon /></button>
    </SearchBarRow>
    <Desc>受夠郵局官網的分段輸入了嗎？快來試試吧！打英文嘛ok！</Desc>
  </SearchHomeWrapper>
); 