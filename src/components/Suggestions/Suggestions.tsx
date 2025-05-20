import React from 'react';
import { SuggestionsWrapper, SuggestionItem } from './styles';

export interface Suggestion {
  label: string;
  onClick: () => void;
}

interface SuggestionsProps {
  items: Suggestion[];
  activeIndex?: number;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ items, activeIndex }) => (
  <SuggestionsWrapper>
    {items.map((item, idx) => (
      <SuggestionItem key={item.label} active={activeIndex === idx} onClick={item.onClick}>
        {item.label}
      </SuggestionItem>
    ))}
  </SuggestionsWrapper>
); 