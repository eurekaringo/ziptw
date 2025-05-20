import React from 'react';
import styled from 'styled-components';

const ResultContainer = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 24px;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ResultTitle = styled.h2`
  font-size: 24px;
  color: #474747;
  font-family: Inter, sans-serif;
  font-weight: 600;
  margin: 0;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4D83EA;
  font-size: 14px;
  font-family: Inter, sans-serif;
  
  &:hover {
    color: #2D63C8;
  }
`;

const ResultContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ResultItem = styled.div`
  padding: 16px;
  background: #F6F6F6;
  border-radius: 12px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  color: #929292;
  margin-bottom: 4px;
`;

const ItemValue = styled.div`
  font-size: 16px;
  color: #474747;
  font-weight: 500;
`;

export const SearchResult = ({ 
  result,
  onCopy 
}) => {
  if (!result) return null;

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultTitle>搜尋結果</ResultTitle>
        <CopyButton onClick={onCopy}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33333 10H2.66667C2.31305 10 1.97391 9.85953 1.72386 9.60948C1.47381 9.35943 1.33334 9.02029 1.33334 8.66667V2.66667C1.33334 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33334 2.66667 1.33334H8.66667C9.02029 1.33334 9.35943 1.47381 9.60948 1.72386C9.85953 1.97391 10 2.31305 10 2.66667V3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          複製
        </CopyButton>
      </ResultHeader>
      <ResultContent>
        {Object.entries(result).map(([key, value]) => (
          <ResultItem key={key}>
            <ItemLabel>{key}</ItemLabel>
            <ItemValue>{value}</ItemValue>
          </ResultItem>
        ))}
      </ResultContent>
    </ResultContainer>
  );
}; 