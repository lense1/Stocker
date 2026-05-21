import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle, css } from "styled-components";
import { Calendar } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DatePickerGlobalStyle = createGlobalStyle`
  .react-datepicker-wrapper { width: auto; }
  .react-datepicker { font-family: inherit; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .react-datepicker__header { background: white; border-bottom: 1px solid var(--border); }
  .react-datepicker__day--selected { background-color: var(--blue) !important; border-radius: 8px; }
`;

export default function SearchDate({
  type = "range",
  selected,
  onChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  variant = "default",
  width = "120px",
  border = false, // 기본값: 테두리 없음
  shadow = true, // 기본값: 그림자 있음
}) {
  const sDate = startDate ? new Date(startDate) : null;
  const eDate = endDate ? new Date(endDate) : null;
  const singleDate = selected ? new Date(selected) : null;

  const containerProps = {
    $variant: variant,
    $width: width,
    $border: border,
    $shadow: shadow,
  };

  return (
    <>
      <DatePickerGlobalStyle />
      <DateFilterGroup>
        {type === "single" ? (
          <DatePickerContainer {...containerProps}>
            <DatePicker
              selected={singleDate}
              onChange={(date) => onChange(formatDate(date))}
              placeholderText="날짜 선택"
              dateFormat="yyyy-MM-dd"
              className="custom-datepicker"
            />
            <Calendar size={14} className="calendar-icon" />
          </DatePickerContainer>
        ) : (
          <>
            <DatePickerContainer {...containerProps}>
              <DatePicker
                selected={sDate}
                onChange={(date) => onStartDateChange(formatDate(date))}
                placeholderText="시작일"
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
              <Calendar size={14} className="calendar-icon" />
            </DatePickerContainer>

            <DateDivider>~</DateDivider>

            <DatePickerContainer {...containerProps}>
              <DatePicker
                selected={eDate}
                onChange={(date) => onEndDateChange(formatDate(date))}
                placeholderText="종료일"
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                minDate={sDate}
              />
              <Calendar size={14} className="calendar-icon" />
            </DatePickerContainer>
          </>
        )}
      </DateFilterGroup>
    </>
  );
}

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateDivider = styled.span`
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const DatePickerContainer = styled.div`
  position: relative;
  border-radius: 10px;
  width: ${({ $width }) => $width || "auto"};
  transition: all 0.2s;

  box-shadow: ${({ $shadow }) => ($shadow ? "var(--shadow)" : "none")};
  border: ${({ $border }) =>
    $border ? "1px solid var(--border)" : "1px solid transparent"};

  &:focus-within {
    border-color: var(--focus-border);
  }
  .react-datepicker-wrapper {
    width: 100%;
  }

  .calendar-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--placeholder);
    pointer-events: none;
    z-index: 1;
  }

  .custom-datepicker {
    width: 100%;
    height: ${({ $variant }) => ($variant === "inventory" ? "44px" : "38px")};
    padding: 0 34px 0 12px;
    border-radius: 10px;
    border: none;
    background: white;
    color: var(--font);
    font-size: 13px;
    outline: none;
    cursor: pointer;
  }
`;
