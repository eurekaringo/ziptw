import styled from 'styled-components';
import tokens from '../../tokens.json';

export const SearchHomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.xl};
  padding-top: 10vh;
`;

export const Title = styled.h1`
  color: ${tokens.color.primary};
  font-size: 60px;
  font-weight: 900;
  text-align: center;
  margin: 0;
`;

export const SubTitle = styled.h2`
  color: ${tokens.color.gradient};
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 ${tokens.spacing.md} 0;
  background: linear-gradient(90deg, #4285F4 0%, #E57373 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  width: 700px;
  background: ${tokens.color.bgInput};
  border-radius: ${tokens.radius.pill};
  border: 1.5px solid ${tokens.color.primaryLight};
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  gap: ${tokens.spacing.md};
  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 24px;
    color: ${tokens.color.text};
    outline: none;
    &::placeholder {
      color: ${tokens.color.textSecondary};
    }
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }
`;

export const Desc = styled.div`
  color: ${tokens.color.textSecondary};
  font-size: 20px;
  text-align: center;
  margin-top: ${tokens.spacing.sm};
`; 