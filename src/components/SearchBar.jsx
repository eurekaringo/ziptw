import React from 'react';
import styled, { css } from 'styled-components';

const StyledSearchBar = styled.div`
  height: 80px;
  padding: 20px 40px;
  background: #F6F6F6;
  border-radius: 100px;
  outline: 1px #4D83EA solid;
  outline-offset: -1px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: outline 0.2s, box-shadow 0.2s;
  ${props => props.$active && css`
    outline: 2px #4D83EA solid;
    outline-offset: -2px;
  `}
  ${props => props.$hover && css`
    box-shadow: 0 0 0 2px #8FB5FF33;
  `}
`;

const StyledInput = styled.input`
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

export const SearchBar = ({ value, onChange, onFocus, onBlur, onCamera, onMic, onSearch, placeholder, $active, $hover }) => (
  <StyledSearchBar $active={$active} $hover={$hover}>
    <StyledInput
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
    />
    <IconGroup>
      <button type="button" aria-label="拍照" onClick={onCamera} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        {/* Camera Icon 可用 SVG 或 Ant Design Icon 取代 */}
        <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="1.39" y="1.1" width="37.51" height="34.18" fill="#696969"/></svg>
      </button>
      <button type="button" aria-label="語音" onClick={onMic} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="7.9" y="3.14" width="24.2" height="32.36" fill="#696969"/></svg>
      </button>
      <button type="button" aria-label="搜尋" onClick={onSearch} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <svg width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/><rect x="4.74" y="4.78" width="30.51" height="30.5" fill="#696969"/></svg>
      </button>
    </IconGroup>
  </StyledSearchBar>
); 