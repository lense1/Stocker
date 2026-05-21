import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SummaryCard from "../../../components/SummaryCard";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import ToggleSwitch from "../../../components/ToggleSwitch";

import {
  getAdminMatchingList,
  getAdminMatchingSummary,
  patchAdminMatchingAiPricing,
} from "../../../api/adminMatching";

const saleStatusLabelMap = {
  ON_SALE: "판매중",
  READY: "판매예정",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
};

const saleStatusStyleMap = {
  판매중: { label: "판매중", variant: "success" },
  판매예정: { label: "판매예정", variant: "info" },
  판매중지: { label: "판매중지", variant: "warning" },
  품절: { label: "품절", variant: "danger" },
  판매종료: { label: "판매종료", variant: "purple" },
};

const matchStatusOptions = [
  { label: "매칭", value: "매칭" },
  { label: "미매칭", value: "미매칭" },
];

const matchingStyleMap = {
  매칭: { label: "매칭", variant: "success" },
  미매칭: { label: "미매칭", variant: "danger" },
};

function toDateValue(dateTimeText = "") {
  return dateTimeText.split(" ")[0].replace(/\//g, "-");
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "-";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "-";
  return `${numberValue.toLocaleString()}원`;
}

function formatDateTimeDisplay(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function formatDateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const mapMatchingRow = (item) => {
  const catalogNo = item.catalog_external_id ?? "-";
  const matched = Boolean(item.catalog_external_id);

  return {
    id: item.id,
    matchStatus: matched ? "매칭" : "미매칭",
    matchYn: matched ? "Y" : "N",
    catalogNo,
    productCode: item.product_code ?? "-",
    productName: item.product_name ?? "-",
    category: item.category_path ?? "-",
    price: formatPrice(item.sale_price),
    useAiPrice: Boolean(item.ai_pricing_enabled),
    saleStatus: saleStatusLabelMap[item.sale_status] ?? item.sale_status ?? "-",
    updatedDate: formatDateOnly(item.updated_at),
    updatedAt: formatDateTimeDisplay(item.updated_at),
  };
};

export default function MatchingManage() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [matchFilter, setMatchFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [summaryData, setSummaryData] = useState(null);

  const categoryOptions = useMemo(() => {
    return [...new Set(rows.map((item) => item.category).filter(Boolean))].map(
      (value) => ({
        label: value,
        value,
      }),
    );
  }, [rows]);

  const fetchRows = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAdminMatchingList();
      const items = Array.isArray(response)
        ? response
        : (response?.items ?? []);
      setRows(items.map(mapMatchingRow));
    } catch (error) {
      console.error(error);
      setRows([]);
      setErrorMessage(
        error?.response?.data?.detail ||
          "카탈로그 매칭 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await getAdminMatchingSummary();
      setSummaryData(response.summary);
    } catch (error) {
      console.error(error);
      setSummaryData(null);
    }
  };

  useEffect(() => {
    fetchRows();
    fetchSummary();
  }, []);

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      matchedCount: rows.filter((item) => item.matchStatus === "매칭").length,
      unmatchedCount: rows.filter((item) => item.matchStatus === "미매칭")
        .length,
      aiPriceCount: rows.filter((item) => item.useAiPrice).length,
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((item) => {
      const itemDate = toDateValue(item.updatedAt);

      const matchesSearch =
        !keyword ||
        item.catalogNo.toLowerCase().includes(keyword) ||
        item.productCode.toLowerCase().includes(keyword) ||
        item.productName.toLowerCase().includes(keyword);

      const matchesCategory = categoryValue
        ? item.category === categoryValue
        : true;
      const matchesMatchStatus = matchFilter
        ? item.matchStatus === matchFilter
        : true;

      const matchesStartDate = startDate ? item.updatedDate >= startDate : true;
      const matchesEndDate = endDate ? item.updatedDate <= endDate : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMatchStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [rows, searchValue, categoryValue, matchFilter, startDate, endDate]);

  const handleToggleAiPrice = async (row, checked) => {
    const actionKey = `${row.id}:ai`;
    const previousRows = rows;

    try {
      setPendingActionKey(actionKey);

      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, useAiPrice: checked } : item,
        ),
      );

      await patchAdminMatchingAiPricing(row.id, checked);
    } catch (error) {
      console.error(error);
      setRows(previousRows);
      alert(
        error?.response?.data?.detail || "AI 가격 설정 변경에 실패했습니다.",
      );
    } finally {
      setPendingActionKey("");
    }
  };

  const columns = [
    {
      key: "matchStatus",
      title: "매칭 여부",
      width: "90px",
      sortable: false,
      render: (value) => {
        const status = matchingStyleMap[value] || {
          label: "매칭",
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="62px"
          />
        );
      },
    },
    // 하린 : 위 매칭여부 Status에서 매칭 상태를 알 수 있어서 아래 매칭상태는 굳이 필요 없을 것 같아 주석처리함
    // {
    //   key: "matchYn",
    //   title: "매칭상태",
    //   width: "80px",
    //   sortable: false,
    //   render: (value) => (
    //     <MatchYnText $matched={value === "Y"}>{value}</MatchYnText>
    //   ),
    // },
    {
      key: "catalogNo",
      title: "카탈로그번호",
      width: "120px",
      render: (value) =>
        value && value !== "-" ? (
          <CatalogLinkButton
            type="button"
            onClick={() =>
              window.open(
                `https://search.shopping.naver.com/catalog/${value}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            {value}
          </CatalogLinkButton>
        ) : (
          <DashText>-</DashText>
        ),
    },
    {
      key: "productCode",
      title: "상품코드",
      width: "120px",
      render: (value, row) => (
        <ActionTextButton
          type="button"
          onClick={() =>
            nav(`/admin/product-update/${row.productCode}`, {
              state: { product: row },
            })
          }
        >
          {value}
        </ActionTextButton>
      ),
    },
    {
      key: "productName",
      title: "상품명",
      width: "250px",
      render: (value, row) => (
        <ProductNameButton
          type="button"
          onClick={() =>
            window.open(
              `/product-detail?productCode=${row.productCode}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          {value}
        </ProductNameButton>
      ),
    },
    {
      key: "category",
      title: "카테고리",
      width: "190px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
    {
      key: "price",
      title: "판매가",
      width: "100px",
    },
    {
      key: "useAiPrice",
      title: "AI 가격변경",
      width: "110px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            disabled={pendingActionKey === `${row.id}:ai`}
            onChange={(checked) => handleToggleAiPrice(row, checked)}
          />
        </CenterCell>
      ),
    },
    {
      key: "saleStatus",
      title: "판매상태",
      width: "110px",
      sortable: false,
      render: (value) => {
        const status = saleStatusStyleMap[value] || {
          label: value,
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="84px"
          />
        );
      },
    },
    {
      key: "updatedAt",
      title: "최근변경일",
      width: "130px",
      sortType: "date",
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <Title>카탈로그 매칭 조회</Title>

      {isLoading && (
        <PageStatusText>카탈로그 매칭 목록을 불러오는 중입니다.</PageStatusText>
      )}
      {!isLoading && errorMessage && (
        <PageStatusText $error>{errorMessage}</PageStatusText>
      )}

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          value={
            <>
              {summaryData?.total_count ?? summary.totalCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summaryData?.total_diff ?? 0)} SKU`}
          up={(summaryData?.total_diff ?? 0) >= 0}
        />
        <SummaryCard
          title="카탈로그 매칭 상품"
          value={
            <>
              {summaryData?.matched_count ?? summary.matchedCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summaryData?.matched_diff ?? 0)} SKU`}
          up={(summaryData?.matched_diff ?? 0) >= 0}
        />
        <SummaryCard
          title="카탈로그 미매칭 상품"
          value={
            <>
              {summaryData?.unmatched_count ?? summary.unmatchedCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summaryData?.unmatched_diff ?? 0)} SKU`}
          up={(summaryData?.unmatched_diff ?? 0) >= 0}
        />
        <SummaryCard
          title="AI 가격변경 상품"
          value={
            <>
              {summaryData?.ai_price_count ?? summary.aiPriceCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summaryData?.ai_price_diff ?? 0)} SKU`}
          up={(summaryData?.ai_price_diff ?? 0) >= 0}
        />
      </SummaryGrid>

      <TableComponent
        columns={columns}
        data={filteredData}
        rowKey="id"
        headerAlign="center"
        cellAlign="center"
        // 1. SearchBar 설정
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(1);
        }}
        searchPlaceholder="상품명, 상품코드로 검색"
        // 2. SearchDate 설정
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        // 3. SelectBar 1 (카테고리)
        filterValue={categoryValue}
        onFilterChange={(val) => {
          setCategoryValue(val);
          setPage(1);
        }}
        filterPlaceholder="카테고리 전체"
        filterOptions={categoryOptions}
        // 4. SelectBar 2 (매칭상태) - [NEW]
        filterValue2={matchFilter}
        onFilterChange2={(val) => {
          setMatchFilter(val);
          setPage(1);
        }}
        filterPlaceholder2="매칭상태 전체"
        filterOptions2={matchStatusOptions}
        // [CHANGE] 초기화 버튼 삭제 (extraToolbar 비움)
        extraToolbar={null}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </PageWrap>
  );
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ExtraToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const DateInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
`;

const MatchSelectWrap = styled.div`
  position: relative;
`;

const MatchSelect = styled.select`
  height: 38px;
  min-width: 110px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const ResetButton = styled.button`
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const ActionTextButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductNameButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const CatalogLinkButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const MatchYnText = styled.span`
  color: ${({ $matched }) => ($matched ? "#16a34a" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
`;

const DashText = styled.span`
  color: #9ca3af;
  font-size: 13px;
`;

const SubText = styled.span`
  color: #6b7280;
  font-size: 12px;
`;

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageStatusText = styled.div`
  margin-bottom: 14px;
  color: ${({ $error }) => ($error ? "#dc2626" : "#6b7280")};
  font-size: 13px;
  font-weight: 600;
`;
