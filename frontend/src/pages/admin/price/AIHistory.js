import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAdminPriceHistory } from "../../../api/adminPrice";
import RateBadge from "../../../components/RateBadge";
import SearchDate from "../../../components/SearchDate";
import SearchBar from "../../../components/SearchBar";

export default function AIHistory() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    keyword: "",
  });

  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const rows = result?.histories ?? [];
  const product = result?.product ?? null;
  const catalog = result?.catalog ?? null;

  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pagedRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return rows.slice(startIndex, startIndex + pageSize);
  }, [rows, page, pageSize]);

  const handleStartDateChange = (val) =>
    setFilters((prev) => ({ ...prev, startDate: val }));
  const handleEndDateChange = (val) =>
    setFilters((prev) => ({ ...prev, endDate: val }));
  const handleKeywordChange = (val) =>
    setFilters((prev) => ({ ...prev, keyword: val }));

  const handleSearch = async () => {
    const keyword = filters.keyword.trim();
    if (!keyword) {
      setSearched(true);
      setResult(null);
      setErrorMessage("상품명 또는 상품코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getAdminPriceHistory({
        keyword,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setResult(data);
      setSearched(true);
      setPage(1);
    } catch (error) {
      setResult(null);
      setSearched(true);
      setErrorMessage(error?.response?.data?.detail || "조회 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const renderEmptyState = () => (
    <EmptyStateWrap>
      <AlertTriangle size={54} strokeWidth={1.8} />
      <EmptyText>
        {isLoading ? "조회 중입니다..." : errorMessage || "상품을 검색하세요"}
      </EmptyText>
    </EmptyStateWrap>
  );

  const renderResult = () => (
    <ResultArea>
      <SectionCard>
        <SectionTitle>상품정보</SectionTitle>
        <FormGrid>
          <FormRow>
            <FormLabel>상품코드</FormLabel>
            <FormField>
              <CodeLinkInput
                to={`/admin/product-update/${product.product_code}`}
              >
                {product.product_code}
              </CodeLinkInput>
            </FormField>
          </FormRow>
          <FormRow>
            <FormLabel>상품명</FormLabel>
            <FormField>
              <Input readOnly value={product.product_name} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormLabel>판매가</FormLabel>
            <FormField>
              <UnitInputWrap>
                <Input readOnly value={formatNumber(product.sale_price)} />
                <UnitText>원</UnitText>
              </UnitInputWrap>
            </FormField>
          </FormRow>
        </FormGrid>
      </SectionCard>

      <SectionCard>
        <SectionTitle>가격비교 정보</SectionTitle>
        <FormGrid>
          <FormRow>
            <FormLabel>카탈로그 ID</FormLabel>
            <FormField>
              <UnitInputWrap>
                <Input readOnly value={catalog?.external_catalog_id || "-"} />
              </UnitInputWrap>
            </FormField>
          </FormRow>
          <FormRow>
            <FormLabel>카탈로그명</FormLabel>
            <FormField>
              <Input readOnly value={catalog?.catalog_name || "-"} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormLabel>최저가</FormLabel>
            <FormField>
              <UnitInputWrap>
                <Input
                  readOnly
                  value={
                    catalog?.market_lowest_price != null
                      ? formatNumber(catalog.market_lowest_price)
                      : "-"
                  }
                />
                <UnitText>원</UnitText>
              </UnitInputWrap>
            </FormField>
          </FormRow>
        </FormGrid>
      </SectionCard>

      <SectionCard>
        <SectionTitle>상세이력</SectionTitle>

        <TableCard>
          <TableScroll>
            <StyledTable>
              <thead>
                <tr>
                  <th>일자</th>
                  <th>판매가</th>
                  <th>판매량</th>
                  <th>시간당판매량</th>
                  <th>최저가여부</th>
                  <th>최저가</th>
                  <th>최저가대비</th>
                  <th>최저가제한</th>
                  <th>최고가제한</th>
                  <th>회당조정가 제한</th>
                  <th>재고</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((item, index) => {
                  const priceRate = formatRate(item.market_gap_rate);
                  const isNegative = Number(item.market_gap_rate ?? 0) < 0;
                  return (
                    <tr key={`${item.logged_at}-${index}`}>
                      <td>{formatDateTime(item.logged_at)}</td>
                      <td>{formatWon(item.applied_sale_price)}</td>
                      <td>{formatQty(item.sales_qty)}</td>
                      <td>{formatPerHour(item.sales_per_hour)}</td>
                      <LowestTextCell
                        $isLowest={item.is_lowest_price ? "Y" : "N"}
                      >
                        {item.is_lowest_price ? "Y" : "N"}
                      </LowestTextCell>
                      <td>{formatWon(item.market_lowest_price)}</td>
                      <td>
                        <GapWrap>
                          <div>
                            {item.market_gap_amount == null
                              ? "-"
                              : formatWon(item.market_gap_amount)}
                          </div>
                          <RateBadge
                            value={priceRate || "-"}
                            isGood={isNegative}
                          />
                        </GapWrap>
                      </td>
                      <td>{formatWon(item.min_price_limit)}</td>
                      <td>{formatWon(item.max_price_limit)}</td>
                      <td>{formatWon(item.price_per_time)}</td>
                      <td>{formatQty(item.remaining_stock)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>
          </TableScroll>
        </TableCard>

        <PaginationRow>
          <PageSizeBox>
            <span>Showing</span>
            <PageSizeSelect
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </PageSizeSelect>
            <span>of {totalCount}</span>
          </PageSizeBox>
          <Pagination>
            <PageButton
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <PageButton
                key={num}
                $active={page === num}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </PageButton>
            ))}
            <PageButton
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </PageButton>
          </Pagination>
        </PaginationRow>
      </SectionCard>
    </ResultArea>
  );

  return (
    <PageWrap>
      <Title>AI 가격변경 이력 조회</Title>

      <FilterBarCard>
        <SearchDate
          startDate={filters.startDate}
          onStartDateChange={handleStartDateChange}
          endDate={filters.endDate}
          onEndDateChange={handleEndDateChange}
        />
        <SearchBar
          value={filters.keyword}
          onChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder="상품명, 상품코드로 검색"
        />
        <SearchButton type="button" onClick={handleSearch} disabled={isLoading}>
          조회
        </SearchButton>
      </FilterBarCard>

      {searched && result && rows.length > 0
        ? renderResult()
        : renderEmptyState()}
    </PageWrap>
  );
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString();
}
function formatWon(value) {
  return value == null ? "-" : `${formatNumber(value)}원`;
}
function formatQty(value) {
  return value == null ? "-" : `${formatNumber(value)}개`;
}
function formatPerHour(value) {
  return value == null ? "-" : `${Number(value).toLocaleString()}개`;
}
function formatRate(value) {
  if (value == null) return null;
  const num = Number(value);
  return `${num > 0 ? "+" : ""}${num}%`;
}
function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yy}/${mm}/${dd} ${hh}:${mi}`;
}

const PageWrap = styled.div`
  padding: 25px;
  background: var(--background);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--title);
  font-weight: 700;
`;

const FilterBarCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchButton = styled.button`
  height: 38px;
  padding: 0 20px;
  background: var(--blue);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow);
  &:disabled {
    opacity: 0.6;
  }
  &:hover:enabled {
    filter: brightness(1.1);
  }
`;

const ResultArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionCard = styled.section`
  padding: 18px 20px;
  box-shadow: var(--shadow);
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  color: var(--font);
  font-size: 17px;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const FormLabel = styled.label`
  color: var(--font);
  font-size: 13px;
  font-weight: 500;
`;

const FormField = styled.div`
  min-width: 0;
`;

const CodeLinkInput = styled(Link)`
  max-width: 220px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: var(--focus-border);
  }
`;

const UnitInputWrap = styled.div`
  position: relative;
  max-width: 220px;
`;

const UnitText = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 500;
`;

const TableCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  th,
  td {
    padding: 14px 12px;
    text-align: center;
    border-bottom: 1px solid var(--border);
    font-size: 12px;
    white-space: nowrap;
    color: var(--font);
  }
  th {
    background: #f9fafc;
    font-weight: 700;
    color: var(--placeholder);
  }
`;

const LowestTextCell = styled.td`
  font-weight: 700 !important;
  color: ${({ $isLowest }) =>
    $isLowest === "Y" ? "var(--green)" : "var(--red)"} !important;
`;

const GapWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const PageSizeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--placeholder);
  font-size: 13px;
`;

const PageSizeSelect = styled.select`
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  outline: none;
  padding: 0 5px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PageButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--blue)" : "var(--border)")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "white")};
  color: ${({ $active }) => ($active ? "white" : "var(--font)")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
  }
`;

const EmptyStateWrap = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--placeholder);
  border-radius: 16px;
  box-shadow: var(--shadow);
`;

const EmptyText = styled.p`
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
`;
