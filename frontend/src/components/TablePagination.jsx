import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function TablePagination({
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}) {
  const currentPage = Math.min(page, totalPages);
  const startCount = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endCount = Math.min(currentPage * pageSize, totalCount);

  const PAGE_GROUP_SIZE = 10;

  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const totalGroups = Math.ceil(totalPages / PAGE_GROUP_SIZE);

  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(currentGroup * PAGE_GROUP_SIZE, totalPages);

  const renderPagination = () => {
    const pages = [];

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(
        <PageButton
          key={i}
          type="button"
          $active={i === currentPage}
          onClick={() => onPageChange?.(i)}
        >
          {i}
        </PageButton>,
      );
    }
    return pages;
  };

  /* 10페이지씩 앞/뒤로 이동 */
  const handlePrevGroup = () => {
    if (currentGroup > 1) {
      onPageChange?.((currentGroup - 2) * PAGE_GROUP_SIZE + 1);
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups) {
      onPageChange?.(currentGroup * PAGE_GROUP_SIZE + 1);
    }
  };

  return (
    <Footer>
      <FooterLeft>
        <LeftGroup>
          <span>Showing</span>

          <PageSizeWrap>
            <PageSizeSelect
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>

            <SelectIcon>
              <ChevronDown size={14} />
            </SelectIcon>
          </PageSizeWrap>
        </LeftGroup>

        <CountText>
          {startCount}-{endCount} of {totalCount}
        </CountText>
      </FooterLeft>

      <Pagination>
        <ArrowButton
          type="button"
          onClick={handlePrevGroup}
          disabled={currentGroup <= 1}
        >
          <ChevronsLeft size={14} />
        </ArrowButton>

        <ArrowButton
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={14} />
        </ArrowButton>

        {renderPagination()}

        <ArrowButton
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={14} />
        </ArrowButton>

        <ArrowButton
          type="button"
          onClick={handleNextGroup}
          disabled={currentGroup >= totalGroups}
        >
          <ChevronsRight size={14} />
        </ArrowButton>
      </Pagination>
    </Footer>
  );
}

const Footer = styled.div`
  margin-top: 20px;
  padding: 0 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: var(--placeholder);
  font-size: 13px;
  white-space: nowrap;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const CountText = styled.span`
  flex-shrink: 0;
`;

const PageSizeWrap = styled.div`
  position: relative;
`;

const PageSizeSelect = styled.select`
  height: 32px;
  min-width: 54px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  color: var(--font);
  font-size: 12px;
  appearance: none;
  cursor: pointer;
  outline: none;
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--placeholder);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

// const Number = styled.div`
//   width: 30px;
//   height: 30px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const ArrowButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #ffffff;
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

const PageButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--blue)" : "var(--border)")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "var(--placeholder)")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;
