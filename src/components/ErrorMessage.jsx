import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: #FFF2F2;
  border: 1px solid #FFE5E5;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  color: #FF4D4F;
  flex-shrink: 0;
`;

const ErrorText = styled.div`
  color: #FF4D4F;
  font-size: 14px;
  font-family: Inter, sans-serif;
`;

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <ErrorContainer>
      <ErrorIcon>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ErrorIcon>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
}; 