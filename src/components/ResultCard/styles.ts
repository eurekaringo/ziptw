import styled from 'styled-components';
import tokens from '../../tokens.json';

export const CardWrapper = styled.div`
  background: ${tokens.color.bgCard};
  border-radius: ${tokens.radius.lg};
  padding: ${tokens.spacing.xl};
  min-width: 600px;
  margin-top: ${tokens.spacing.lg};
  box-shadow: 0 2px 16px #0001;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const ZhText = styled.div`
  font-size: 24px;
  color: ${tokens.color.text};
  font-weight: 700;
  margin-bottom: ${tokens.spacing.sm};
`;

export const EnText = styled.div`
  font-size: 18px;
  color: ${tokens.color.textSecondary};
  margin-bottom: ${tokens.spacing.md};
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
`;

export const CopyButton = styled.button`
  background: ${tokens.color.primary};
  color: #fff;
  border: none;
  border-radius: ${tokens.radius.pill};
  padding: 0 ${tokens.spacing.lg};
  height: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${tokens.color.primaryDark};
  }
`; 