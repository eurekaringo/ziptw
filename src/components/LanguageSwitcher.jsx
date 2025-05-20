import React from 'react';
import styled from 'styled-components';

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherButton = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #474747;
  font-size: 16px;
  font-family: Inter, sans-serif;
  
  &:hover {
    color: #4D83EA;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  margin-top: 8px;
  min-width: 120px;
  z-index: 1000;
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #474747;
  font-size: 16px;
  font-family: Inter, sans-serif;
  
  &:hover {
    background: #F6F6F6;
  }
  
  ${props => props.$active && `
    color: #4D83EA;
    font-weight: 500;
  `}
`;

export const LanguageSwitcher = ({
  currentLanguage,
  languages,
  onLanguageChange,
  isOpen,
  onToggle
}) => {
  return (
    <SwitcherContainer>
      <SwitcherButton onClick={onToggle}>
        {currentLanguage}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </SwitcherButton>
      {isOpen && (
        <Dropdown>
          {languages.map(lang => (
            <LanguageOption
              key={lang}
              $active={lang === currentLanguage}
              onClick={() => {
                onLanguageChange(lang);
                onToggle();
              }}
            >
              {lang}
            </LanguageOption>
          ))}
        </Dropdown>
      )}
    </SwitcherContainer>
  );
}; 