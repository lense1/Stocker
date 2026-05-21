import React, { useState } from "react";
import styled, { css } from "styled-components";
import { ChevronDown } from "lucide-react";

export default function SelectBar({
  options,
  value,
  onChange,
  placeholder,
  variant = "default",
  width,
  border = false, // 기본값: 테두리 없음
  shadow = true, // 기본값: 그림자 있음
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(
    (opt) => (opt.value ?? opt.label) === value,
  )?.label;

  return (
    <SelectWrap
      style={{ width: width || (variant === "inventory" ? "126px" : "180px") }}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
    >
      <SelectTrigger
        type="button"
        $variant={variant}
        $border={border}
        $shadow={shadow}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "placeholder" : ""}>
          {selectedLabel || placeholder}
        </span>
        <FilterIcon $isOpen={isOpen}>
          <ChevronDown size={15} />
        </FilterIcon>
      </SelectTrigger>

      {isOpen && (
        <SelectList>
          {placeholder && (
            <SelectItem
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              $active={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectList>
      )}
    </SelectWrap>
  );
}

const SelectWrap = styled.div`
  position: relative;
  cursor: pointer;
`;

const SelectTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  padding: 0 12px;
  height: ${({ $variant }) => ($variant === "inventory" ? "44px" : "38px")};
  transition: all 0.2s;

  box-shadow: ${({ $shadow }) => ($shadow ? "var(--shadow)" : "none")};
  border: ${({ $border }) =>
    $border ? "1px solid var(--border)" : "1px solid transparent"};

  &:hover {
    border-color: var(--focus-border);
  }

  .placeholder {
    color: var(--placeholder);
    font-size: 13px;
  }
`;

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--placeholder);
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const SelectList = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 6px;
  z-index: 100;
  list-style: none;
  margin: 0;
`;

const SelectItem = styled.li`
  padding: 10px 12px;
  font-size: 12px;
  border-radius: 8px;
  color: ${({ $active }) => ($active ? "var(--blue)" : "var(--font)")};
  background: ${({ $active }) => ($active ? "var(--choice)" : "transparent")};
  &:hover {
    background: var(--choice);
    color: var(--blue);
  }
`;
