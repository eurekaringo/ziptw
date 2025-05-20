import styled, { css } from 'styled-components';
import tokens from '../../tokens.json';

export const SuggestionsWrapper = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
  margin-top: ${tokens.spacing.sm};
`;

export const SuggestionItem = styled.button<{active?: boolean}>`
  background: ${tokens.color.bgInput};
  border: 1.5px solid ${tokens.color.primaryLight};
  border-radius: ${tokens.radius.pill};
  padding: 0 ${tokens.spacing.lg};
  height: 40px;
  font-size: 18px;
  color: ${tokens.color.text};
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  ${props => props.active && css`
    background: ${tokens.color.primaryLight};
    border-color: ${tokens.color.primary};
    color: ${tokens.color.primary};
    font-weight: 700;
  `}
`; 