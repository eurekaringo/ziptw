import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../components/SearchBar';
import { SearchSuggestion } from '../components/SearchSuggestion';
import { SearchResult } from '../components/SearchResult';
import { PrivacyPopup } from '../components/PrivacyPopup';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { searchAddress, getSuggestions } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: #FFFFFF;
`;

const Header = styled.header`
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: flex-end;
`;

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #474747;
  font-family: Inter, sans-serif;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
`;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('繁體中文');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearchHover, setIsSearchHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = ['繁體中文', 'English', '日本語'];

  useEffect(() => {
    // 檢查是否已接受隱私權政策
    const hasAcceptedPrivacy = localStorage.getItem('privacyAccepted');
    if (hasAcceptedPrivacy) {
      setIsPrivacyOpen(false);
    }
  }, []);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = useCallback(async (term) => {
    if (!term) {
      setSuggestions([]);
      setResult(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [suggestionsData, searchData] = await Promise.all([
        getSuggestions(term),
        searchAddress(term)
      ]);

      setSuggestions(suggestionsData);
      setResult(searchData);
    } catch (error) {
      setError(error.message);
      setSuggestions([]);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term) => handleSearch(term), 300),
    [handleSearch]
  );

  const handlePrivacyAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setIsPrivacyOpen(false);
  };

  const handlePrivacyDecline = () => {
    // 可以導向其他頁面或顯示其他訊息
    alert('您必須接受隱私權政策才能使用本服務');
  };

  const handleCopy = () => {
    if (result) {
      const text = Object.entries(result)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      navigator.clipboard.writeText(text);
      alert('已複製到剪貼簿');
    }
  };

  return (
    <Container>
      <Header>
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          languages={languages}
          onLanguageChange={setCurrentLanguage}
          isOpen={isLanguageOpen}
          onToggle={() => setIsLanguageOpen(!isLanguageOpen)}
        />
      </Header>

      <Main>
        <Title>郵遞區號查詢</Title>
        
        <SearchBar
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debouncedSearch(e.target.value);
          }}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
          onMouseEnter={() => setIsSearchHover(true)}
          onMouseLeave={() => setIsSearchHover(false)}
          onCamera={() => alert('拍照功能開發中')}
          onMic={() => alert('語音功能開發中')}
          onSearch={() => handleSearch(searchTerm)}
          placeholder="請輸入地址"
          $active={isSearchActive}
          $hover={isSearchHover}
        />

        {error && <ErrorMessage message={error} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {suggestions.length > 0 && (
              <SearchSuggestion
                suggestions={suggestions}
                activeIndex={activeIndex}
                onSelect={(suggestion) => {
                  setSearchTerm(suggestion);
                  handleSearch(suggestion);
                  setSuggestions([]);
                }}
                searchTerm={searchTerm}
              />
            )}

            {result && (
              <SearchResult
                result={result}
                onCopy={handleCopy}
              />
            )}
          </>
        )}
      </Main>

      <PrivacyPopup
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />
    </Container>
  );
} 