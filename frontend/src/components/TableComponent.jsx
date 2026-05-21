import React, { useMemo, useState } from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import TablePagination from "./TablePagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchDate from "./SearchDate";
import SelectBar from "./SelectBar";
import SearchBar from "./SearchBar";

const DatePickerStyle = createGlobalStyle`
  .react-datepicker-wrapper {
    width: auto;
  }
  .react-datepicker {
    font-family: "Pretendard", sans-serif;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .react-datepicker__header {
    background-color: #ffffff;
    border-bottom: 1px solid #f1f5f9;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding-top: 10px;
  }
  .react-datepicker__day--selected {
    background-color: #2563eb !important; 
    border-radius: 8px;
  }
  .react-datepicker__day:hover {
    border-radius: 8px;
  }
`;

export default function TableComponent({
  columns = [],
  data = [],
  rowKey = "id",
  variant = "default",
  headerAlign = "left",
  cellAlign = "left",

  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",

  filterValue = "",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Filter",

  filterValue2 = "",
  onFilterChange2,
  filterOptions2 = [],
  filterPlaceholder2 = "Filter 2",

  filterValue3 = "",
  onFilterChange3,
  filterOptions3 = [],
  filterPlaceholder3 = "Filter 3",

  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,

  extraToolbar = null,
  toolbarRight = null,
  customToolbar = null,

  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const handleSort = (column) => {
    if (column.sortable === false) return;

    setSortConfig((prev) => {
      if (prev.key === column.key) {
        return {
          key: column.key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  const isNumericLike = (value) => {
    if (typeof value === "number") return true;
    if (typeof value !== "string") return false;

    const trimmed = value.trim();
    return /^[₩$€£¥+\-]?\s?[\d,.]+%?$/.test(trimmed);
  };

  const parseNumericLike = (value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return NaN;

    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned) return NaN;

    return Number(cleaned);
  };

  const getSortValue = (row, column) => {
    if (column.sortValue) return column.sortValue(row);
    return row[column.key];
  };

  const compareValues = (aValue, bValue, sortType = "auto") => {
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (sortType === "number") {
      const aNum = parseNumericLike(aValue);
      const bNum = parseNumericLike(bValue);

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
    }

    if (sortType === "date") {
      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();

      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
        return aDate - bDate;
      }
    }

    if (sortType === "auto") {
      const bothNumbers =
        (typeof aValue === "number" && typeof bValue === "number") ||
        (isNumericLike(aValue) && isNumericLike(bValue));

      if (bothNumbers) {
        const aNum = parseNumericLike(aValue);
        const bNum = parseNumericLike(bValue);

        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return aNum - bNum;
        }
      }
    }

    const aText = String(aValue).toLowerCase();
    const bText = String(bValue).toLowerCase();

    return aText.localeCompare(bText, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const targetColumn = columns.find(
      (column) => column.key === sortConfig.key,
    );
    if (!targetColumn) return data;

    const copied = [...data];

    copied.sort((a, b) => {
      const aValue = getSortValue(a, targetColumn);
      const bValue = getSortValue(b, targetColumn);

      const result = compareValues(
        aValue,
        bValue,
        targetColumn.sortType || "auto",
      );

      return sortConfig.direction === "asc" ? result : -result;
    });

    return copied;
  }, [data, columns, sortConfig]);

  const totalCount = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const renderSortIcon = (column) => {
    if (column.sortable === false) return null;

    if (sortConfig.key !== column.key) {
      return <ArrowUpDown size={14} />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

  return (
    <Container>
      <DatePickerStyle />
      <Toolbar $variant={variant}>
        {customToolbar ? (
          <CustomToolbarWrap $variant={variant}>
            {customToolbar}
          </CustomToolbarWrap>
        ) : (
          <>
            <ToolbarLeft $variant={variant}>
              {onStartDateChange && onEndDateChange && (
                <SearchDate
                  variant={variant}
                  startDate={startDate}
                  onStartDateChange={onStartDateChange}
                  endDate={endDate}
                  onEndDateChange={onEndDateChange}
                />
              )}
              {extraToolbar}
              {typeof onSearchChange === "function" && (
                <SearchBar
                  variant={variant}
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              )}

              {typeof onFilterChange === "function" && (
                <SelectBar
                  variant={variant}
                  value={filterValue}
                  onChange={onFilterChange}
                  options={filterOptions}
                  placeholder={filterPlaceholder}
                />
              )}

              {typeof onFilterChange2 === "function" && (
                <SelectBar
                  variant={variant}
                  value={filterValue2}
                  onChange={onFilterChange2}
                  options={filterOptions2}
                  placeholder={filterPlaceholder2}
                  shadow={true}
                />
              )}

              {typeof onFilterChange3 === "function" && (
                <SelectBar
                  variant={variant}
                  value={filterValue3}
                  onChange={onFilterChange3}
                  options={filterOptions3}
                  placeholder={filterPlaceholder3}
                  shadow={true}
                />
              )}
            </ToolbarLeft>

            {toolbarRight && <ToolbarRight>{toolbarRight}</ToolbarRight>}
          </>
        )}
      </Toolbar>

      <Wrap $variant={variant}>
        <TableScroll>
          <StyledTable $variant={variant}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      width: column.width || "auto",
                      textAlign:
                        column.headerAlign ||
                        headerAlign ||
                        column.align ||
                        "left",
                    }}
                  >
                    <HeaderButton
                      type="button"
                      $variant={variant}
                      $sortable={column.sortable !== false}
                      $align={
                        column.headerAlign ||
                        headerAlign ||
                        column.align ||
                        "left"
                      }
                      onClick={() => handleSort(column)}
                    >
                      <span>{column.title}</span>
                      {renderSortIcon(column)}
                    </HeaderButton>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pagedData.length > 0 ? (
                pagedData.map((row, rowIndex) => (
                  <tr key={row[rowKey] ?? rowIndex}>
                    {columns.map((column) => {
                      const value = row[column.key];

                      return (
                        <td
                          key={column.key}
                          style={{
                            textAlign: column.align || cellAlign || "left",
                          }}
                        >
                          {column.render ? column.render(value, row) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <EmptyCell colSpan={columns.length}>
                    데이터가 없습니다.
                  </EmptyCell>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableScroll>

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      </Wrap>
    </Container>
  );
}

export function RowActionButton({ onClick }) {
  return (
    <StyledRowActionButton type="button" onClick={onClick}>
      <MoreHorizontal size={16} />
    </StyledRowActionButton>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Wrap = styled.div`
  width: 100%;
  background: white;
  overflow: hidden;
  border-radius: 16px;
  padding: 15px;
  box-shadow: var(--shadow);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 10px;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 10px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const CustomToolbarWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterSelectWrap = styled.div`
  position: relative;
  box-shadow: var(--shadow);
  min-width: 180px;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  border-radius: 10px;
  background: white;
  font-size: 13px;
  outline: none;
  appearance: none;
  cursor: pointer;
  height: 38px;
  padding: 0 34px 0 14px;
  border: 1px solid transparent;
  color: var(--placeholder);

  &:focus {
    border-color: var(--focus-border);
  }
`;
const FilterIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateInput = styled.input`
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;
  border: 1px solid transparent;
  height: 38px;
  padding: 0 12px;

  &:focus {
    border-color: var(--focus-border);
  }
`;

const DatePickerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow);

  .calendar-icon {
    position: absolute;
    right: 12px;
    color: var(--placeholder);
    z-index: 1;
    pointer-events: none;
  }

  .custom-datepicker {
    width: 130px;
    height: 38px;
    padding: 0 34px 0 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: white;
    color: var(--font);
    font-size: 13px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s;

    &::placeholder {
      color: var(--placeholder);
    }

    &:focus {
      border-color: var(--focus-border);
    }
  }
`;

const DateDivider = styled.span`
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;

  thead th {
    white-space: nowrap;
    background: #ffffff;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--placeholder);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody td {
    position: relative;
    padding: 16px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--font);
    font-size: 12px;
    white-space: nowrap;
    vertical-align: middle;
    background: #ffffff;
  }

  tbody tr:hover td {
    background: var(--hover-bg);
  }
`;

const HeaderButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === "center"
      ? "center"
      : $align === "right"
        ? "flex-end"
        : "flex-start"};
  gap: 6px;
  color: inherit;
  font: inherit;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};

  svg {
    color: var(--placeholder);
    flex-shrink: 0;
  }
`;

const EmptyCell = styled.td`
  padding: 40px 16px !important;
  text-align: center !important;
  color: var(--placeholder) !important;
  font-size: 12px !important;
`;

const StyledRowActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
