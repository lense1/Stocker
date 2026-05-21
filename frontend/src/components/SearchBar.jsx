import React from "react";
import styled, { css } from "styled-components";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  variant = "default",
  width,
  border = false, // 기본값: 테두리 없음
  shadow = true, // 기본값: 그림자 있음
}) {
  const handleSubmit = () => {
    if (onSearch) {
      onSearch(value);
      return;
    }

    onChange(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSearchClick = () => {
    handleSubmit();
  };
  return (
    <SearchWrap
      $variant={variant}
      $width={width}
      $border={border}
      $shadow={shadow}
    >
      <SearchInput
        $variant={variant}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <SearchIcon
        role="button"
        tabIndex={0}
        onClick={handleSearchClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleSearchClick();
          }
        }}
      >
        <Search size={15} />
      </SearchIcon>
    </SearchWrap>
  );
}

const SearchWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ $width, $variant }) =>
    $width || ($variant === "inventory" ? "224px" : "240px")};
  border-radius: 10px;
  transition: all 0.2s;

  box-shadow: ${({ $shadow }) => ($shadow ? "var(--shadow)" : "none")};
  border: ${({ $border }) =>
    $border ? "1px solid var(--border)" : "1px solid transparent"};

  &:focus-within {
    border-color: var(--focus-border);
  }

  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;
  border: none;
  transition: all 0.2s;

  &::placeholder {
    color: var(--placeholder);
  }

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          height: 44px;
          padding: 0 36px 0 14px;
        `
      : css`
          height: 38px;
          padding: 0 34px 0 14px;
        `}
`;
