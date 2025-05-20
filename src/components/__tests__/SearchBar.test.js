import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onCamera: jest.fn(),
    onMic: jest.fn(),
    onSearch: jest.fn(),
    placeholder: '請輸入地址',
    $active: false,
    $hover: false
  };

  it('renders correctly', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('請輸入地址')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('請輸入地址');
    fireEvent.change(input, { target: { value: '測試' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('calls onFocus when input is focused', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('請輸入地址');
    fireEvent.focus(input);
    expect(defaultProps.onFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input is blurred', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('請輸入地址');
    fireEvent.blur(input);
    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  it('calls onCamera when camera button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    const cameraButton = screen.getByLabelText('拍照');
    fireEvent.click(cameraButton);
    expect(defaultProps.onCamera).toHaveBeenCalled();
  });

  it('calls onMic when mic button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    const micButton = screen.getByLabelText('語音');
    fireEvent.click(micButton);
    expect(defaultProps.onMic).toHaveBeenCalled();
  });

  it('calls onSearch when search button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    const searchButton = screen.getByLabelText('搜尋');
    fireEvent.click(searchButton);
    expect(defaultProps.onSearch).toHaveBeenCalled();
  });
}); 