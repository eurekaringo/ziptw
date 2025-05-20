import React from 'react';
import styled from 'styled-components';

const SuggestionContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  padding: 16px 0;
  z-index: 1000;
`;

const SuggestionItem = styled.div`
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #F6F6F6;
  }
  
  ${props => props.$active && `
    background-color: #F6F6F6;
  `}
`;

const SuggestionText = styled.span`
  font-size: 16px;
  color: #474747;
  font-family: Inter, sans-serif;
`;

const Highlight = styled.span`
  color: #4D83EA;
  font-weight: 500;
`;

export const SearchSuggestion = ({ 
  suggestions, 
  activeIndex, 
  onSelect,
  searchTerm 
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <Highlight key={i}>{part}</Highlight> : 
        part
    );
  };

  return (
    <SuggestionContainer>
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={index}
          $active={index === activeIndex}
          onClick={() => onSelect(suggestion)}
        >
          <SuggestionText>
            {highlightMatch(suggestion)}
          </SuggestionText>
        </SuggestionItem>
      ))}
    </SuggestionContainer>
  );
}; 