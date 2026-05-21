import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SummaryCard from "../../../components/SummaryCard";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import ToggleSwitch from "../../../components/ToggleSwitch";
import {
  getAdminPriceSearchList,
  getAdminMatchingSummary,
  patchAdminPriceSearchRow,
} from "../../../api/adminPrice.js";
import RateBadge from "../../../components/RateBadge.jsx";

const STATUS_PALETTE = {
  success: { color: "#1EB564", bg: "#EEFBF4" }, // 판매중
  info: { color: "#0FB7FF", bg: "#F0FAFF" }, // 판매예정
  warning: { color: "#FFC600", bg: "#FFF6D6" }, // 판매중지
  danger: { color: "#BD00FF", bg: "#F9E7FF" }, // 품절
  purple: { color: "#33189D", bg: "#EFECFA" }, // 판매종료
};

const saleStatusOptions = [
  { value: "ON_SALE", label: "판매중" },
  { value: "READY", label: "판매예정" },
  { value: "STOPPED", label: "판매중지" },
  { value: "SOLD_OUT", label: "품절" },
  { value: "ENDED", label: "판매종료" },
];

const saleStatusLabelMap = {
  ON_SALE: "판매중",
  READY: "판매예정",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
};

const getStatusVariant = (label) => {
  switch (label) {
    case "판매중":
      return "success";
    case "판매예정":
      return "info";
    case "판매중지":
      return "warning";
    case "품절":
      return "danger";
    case "판매종료":
      return "purple";
    default:
      return "warning";
  }
};

const lowestStyleMap = {
  Y: { label: "Y", variant: "success" },
  N: { label: "N", variant: "danger" },
  "-": { label: "-", variant: "info" },
};

const defaultSummaryCard = {
  value: 0,
  change: 0,
  change_label: "",
  up: true,
};

const defaultSummaryData = {
  total_products: { ...defaultSummaryCard },
  ai_pricing_products: { ...defaultSummaryCard },
  matched_products: { ...defaultSummaryCard },
  unmatched_products: { ...defaultSummaryCard },
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "-";

  return `${numberValue.toLocaleString()}원`;
};

const formatCount = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "-";

  return `${numberValue.toLocaleString()}개`;
};

const formatRate = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "-";

  return `${numberValue > 0 ? "+" : ""}${numberValue.toFixed(1)}%`;
};

const formatDateOnly = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateTimeDisplay = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const formatSummaryChange = (value) => {
  const amount = Math.abs(Number(value || 0));
  return `${amount} SKU`;
};

const mapPriceRow = (item) => ({
  id: item.id,
  catalogId: item.catalog_external_id ?? "-",
  productCode: item.product_code,
  productName: item.product_name ?? "-",
  salePrice: formatCurrency(item.sale_price),
  lowestPrice: formatCurrency(item.market_lowest_price),
  isLowest:
    item.is_lowest_price === null || item.is_lowest_price === undefined
      ? "-"
      : item.is_lowest_price
        ? "Y"
        : "N",
  priceGap: formatCurrency(item.price_gap),
  priceRate: formatRate(item.price_gap_rate),
  aiPriceChanged: Boolean(item.ai_pricing_enabled),
  minPrice: formatCurrency(item.min_price_limit),
  maxPrice: formatCurrency(item.max_price_limit),
  stock: formatCount(item.stock_qty),
  statusCode: item.sale_status ?? "ON_SALE",
  status: saleStatusLabelMap[item.sale_status] ?? item.sale_status ?? "-",
  category: item.category_path ?? "-",
  updatedDate: formatDateOnly(item.updated_at),
  updatedAt: formatDateTimeDisplay(item.updated_at),
});

export default function PriceSearch() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [summaryData, setSummaryData] = useState(defaultSummaryData);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [lowestYn, setLowestYn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchRows = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [listResponse, summaryResponse] = await Promise.all([
        getAdminPriceSearchList(),
        getAdminMatchingSummary(),
      ]);

      const items = Array.isArray(listResponse)
        ? listResponse
        : (listResponse?.items ?? []);

      setRows(items.map(mapPriceRow));
      setSummaryData(summaryResponse?.summary ?? defaultSummaryData);
    } catch (error) {
      console.error(error);
      setRows([]);
      setSummaryData(defaultSummaryData);
      setErrorMessage(
        error?.response?.data?.detail ||
          "가격 조회 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const categoryOptions = useMemo(() => {
    return [...new Set(rows.map((item) => item.category).filter(Boolean))].map(
      (value) => ({
        label: value,
        value,
      }),
    );
  }, [rows]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.productName.toLowerCase().includes(keyword) ||
        item.productCode.toLowerCase().includes(keyword);

      const matchesCategory = categoryValue
        ? item.category === categoryValue
        : true;

      const matchesLowest = lowestYn ? item.isLowest === lowestYn : true;
      const matchesStartDate = startDate ? item.updatedDate >= startDate : true;
      const matchesEndDate = endDate ? item.updatedDate <= endDate : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLowest &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [rows, searchValue, categoryValue, lowestYn, startDate, endDate]);

  const handleToggleAiPriceChanged = async (productCode, checked) => {
    const actionKey = `${productCode}:ai`;
    const previousRows = rows;

    try {
      setPendingActionKey(actionKey);
      setRows((prev) =>
        prev.map((item) =>
          item.productCode === productCode
            ? { ...item, aiPriceChanged: checked }
            : item,
        ),
      );

      await patchAdminPriceSearchRow(productCode, {
        ai_pricing_enabled: checked,
      });

      await fetchRows();
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

  const handleChangeSaleStatus = async (productCode, nextStatusCode) => {
    const actionKey = `${productCode}:status`;
    const previousRows = rows;

    try {
      setPendingActionKey(actionKey);
      setRows((prev) =>
        prev.map((item) =>
          item.productCode === productCode
            ? {
                ...item,
                statusCode: nextStatusCode,
                status: saleStatusLabelMap[nextStatusCode] ?? nextStatusCode,
              }
            : item,
        ),
      );

      await patchAdminPriceSearchRow(productCode, {
        sale_status: nextStatusCode,
      });

      await fetchRows();
    } catch (error) {
      console.error(error);
      setRows(previousRows);
      alert(error?.response?.data?.detail || "판매상태 변경에 실패했습니다.");
    } finally {
      setPendingActionKey("");
    }
  };

  const handleReset = () => {
    setSearchValue("");
    setCategoryValue("");
    setLowestYn("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const columns = [
    {
      key: "catalogId",
      title: "카탈로그 ID",
      width: "130px",
      render: (value) =>
        value && value !== "-" ? (
          <CatalogLink
            href={`https://search.shopping.naver.com/catalog/${value}`}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </CatalogLink>
        ) : (
          <SubText>-</SubText>
        ),
    },
    {
      key: "productCode",
      title: "상품코드",
      width: "120px",
      render: (value, row) => (
        <CodeLink
          type="button"
          onClick={() =>
            nav(`/admin/product-update/${row.productCode}`, {
              state: { product: row },
            })
          }
        >
          {value}
        </CodeLink>
      ),
    },
    {
      key: "productName",
      title: "상품명",
      width: "250px",
      render: (value, row) => (
        <ProductNameLink
          href={`/product-detail?productCode=${encodeURIComponent(
            row.productCode,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </ProductNameLink>
      ),
    },
    {
      key: "salePrice",
      title: "판매가",
      width: "100px",
    },
    {
      key: "lowestPrice",
      title: "최저가",
      width: "100px",
    },
    {
      key: "isLowest",
      title: "최저가여부",
      width: "90px",
      sortable: false,
      render: (value) => {
        const status = lowestStyleMap[value] || lowestStyleMap["-"];

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="54px"
          />
        );
      },
    },
    {
      key: "priceGap",
      title: "최저가대비",
      width: "110px",
      sortable: false,
      render: (value, row) => (
        <PriceGapWrap>
          <div>{value}</div>
          <RateBadge
            value={row.priceRate}
            isGood={String(row.priceRate).startsWith("-")}
          />
        </PriceGapWrap>
      ),
    },
    {
      key: "aiPriceChanged",
      title: "AI 가격변경",
      width: "96px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            disabled={pendingActionKey === `${row.productCode}:ai`}
            onChange={(checked) =>
              handleToggleAiPriceChanged(row.productCode, checked)
            }
            width={42}
            height={24}
          />
        </CenterCell>
      ),
    },
    {
      key: "minPrice",
      title: "최저가제한",
      width: "100px",
    },
    {
      key: "maxPrice",
      title: "최고가제한",
      width: "100px",
    },
    {
      key: "stock",
      title: "재고",
      width: "90px",
    },
    {
      key: "status",
      title: "판매상태",
      width: "120px",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <StatusBadge
            mode="select"
            value={value}
            variant={getStatusVariant(value)}
            options={saleStatusOptions}
            width="96px"
            disabled={pendingActionKey === `${row.productCode}:status`}
            onChange={(nextValue) =>
              handleChangeSaleStatus(row.productCode, nextValue)
            }
          />
        </CenterCell>
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
      key: "updatedAt",
      title: "최근변경일",
      width: "120px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <Title>가격 관리</Title>

      {isLoading && <PageStatusText>목록을 불러오는 중입니다.</PageStatusText>}
      {!isLoading && errorMessage && (
        <PageStatusText $error>{errorMessage}</PageStatusText>
      )}

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          value={
            <>
              {summaryData.total_products.value}
              <span>SKU</span>
            </>
          }
          change={formatSummaryChange(
            summaryData.total_products.change,
            summaryData.total_products.change_label,
          )}
          up={summaryData.total_products.up}
        />
        <SummaryCard
          title="AI 가격변경 상품"
          value={
            <>
              {summaryData.ai_pricing_products.value}
              <span>SKU</span>
            </>
          }
          change={formatSummaryChange(
            summaryData.ai_pricing_products.change,
            summaryData.ai_pricing_products.change_label,
          )}
          up={summaryData.ai_pricing_products.up}
        />
        <SummaryCard
          title="최저가 유지 상품"
          value={
            <>
              {summaryData.matched_products.value}
              <span>SKU</span>
            </>
          }
          change={formatSummaryChange(
            summaryData.matched_products.change,
            summaryData.matched_products.change_label,
          )}
          up={summaryData.matched_products.up}
        />
        <SummaryCard
          title="최저가 아닌 상품"
          value={
            <>
              {summaryData.unmatched_products.value}
              <span>SKU</span>
            </>
          }
          change={formatSummaryChange(
            summaryData.unmatched_products.change,
            summaryData.unmatched_products.change_label,
          )}
          up={summaryData.unmatched_products.up}
        />
      </SummaryGrid>
      <TableComponent
        variant="price"
        columns={columns}
        data={filteredData}
        headerAlign="center"
        cellAlign="center"
        rowKey="id"
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(1);
        }}
        searchPlaceholder="상품명, 상품코드로 검색"
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
        filterValue={categoryValue}
        onFilterChange={(val) => {
          setCategoryValue(val);
          setPage(1);
        }}
        filterOptions={categoryOptions}
        filterPlaceholder="카테고리 전체"
        filterValue2={lowestYn}
        onFilterChange2={(val) => {
          setLowestYn(val);
          setPage(1);
        }}
        filterOptions2={[
          { label: "최저가(Y)", value: "Y" },
          { label: "미달(N)", value: "N" },
        ]}
        filterPlaceholder2="최저가 여부"
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

const PageStatusText = styled.div`
  margin-bottom: 14px;
  color: ${({ $error }) => ($error ? "var(--red)" : "var(--placeholder)")};
  font-size: 13px;
  font-weight: 600;
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

const SubText = styled.span`
  color: var(--placeholder);
  font-size: 12px;
`;

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceGapWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

const CodeLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const CatalogLink = styled.a`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const ProductNameLink = styled.a`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const SaleStatusSelect = styled.select`
  height: 30px;
  min-width: 96px;
  padding: 0 30px 0 10px;
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-color: ${({ $status }) => {
    if ($status === "판매중") return "#dcf7e8";
    if ($status === "판매중지") return "#fff4cf";
    if ($status === "품절") return "#f4dfff";
    if ($status === "판매종료") return "#ebe7ff";
    if ($status === "판매예정") return "#e8f0ff";
    return "#eef1f5";
  }};

  color: ${({ $status }) => {
    if ($status === "판매중") return "#19b45b";
    if ($status === "판매중지") return "#d79b0c";
    if ($status === "품절") return "#9b45db";
    if ($status === "판매종료") return "#6b5ae0";
    if ($status === "판매예정") return "#2563eb";
    return "#6c7480";
  }};

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
