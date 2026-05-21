import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Plus } from "lucide-react";
import SummaryCard from "../../../components/SummaryCard";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import ToggleSwitch from "../../../components/ToggleSwitch";
import { getCategories } from "../../../api/category";
import {
  getAdminProductList,
  updateAdminProductAiPricing,
  updateAdminProductSaleStatus,
} from "../../../api/adminProduct";

const saleStatusOptions = [
  { label: "판매중", value: "ON_SALE" },
  { label: "판매예정", value: "READY" },
  { label: "판매중지", value: "STOPPED" },
  { label: "품절", value: "SOLD_OUT" },
  { label: "판매종료", value: "ENDED" },
];

const salesStatusLabelMap = {
  ON_SALE: "판매중",
  READY: "판매예정",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
};

const SERVER_FETCH_SIZE = 100;

function mapSaleStatusLabel(value) {
  return salesStatusLabelMap[value] || value || "-";
}

function formatUpdatedAt(value) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function formatNumber(value) {
  return `${Number(value).toLocaleString()}원`;
}

async function fetchAllAdminProducts(params = {}) {
  let currentPage = 1;
  let totalPages = 1;
  let summary = null;
  const allItems = [];

  while (currentPage <= totalPages) {
    const response = await getAdminProductList({
      ...params,
      page: currentPage,
      size: SERVER_FETCH_SIZE,
    });

    if (!summary) {
      summary = response.summary || null;
    }

    allItems.push(...(response.items || []));
    totalPages = Math.max(1, Number(response.total_pages || 1));
    currentPage += 1;
  }

  return {
    items: allItems,
    summary,
    total: allItems.length,
  };
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [reloadTick, setReloadTick] = useState(0);

  const [summary, setSummary] = useState({
    totalCount: 0,
    saleCount: 0,
    soldOutCount: 0,
    aiEnabledCount: 0,
    totalDiff: 0,
    saleDiff: 0,
    soldOutDiff: 0,
    aiEnabledDiff: 0,
  });

  const nav = useNavigate();

  const categoryOptions = useMemo(() => {
    return categories.flatMap((mainCategory) =>
      (mainCategory.subCategories || []).map((subCategory) => ({
        label: `${mainCategory.name} > ${subCategory.name}`,
        value: String(subCategory.id),
      })),
    );
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error(error);
        alert("카테고리 목록 조회에 실패했습니다.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await fetchAllAdminProducts({
          keyword: searchValue.trim() || undefined,
          category_id: categoryValue ? Number(categoryValue) : undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        });

        const mappedItems = (data.items || []).map((item) => ({
          id: item.id,
          productCode: item.product_code,
          productName: item.product_name,
          category: item.category_name,
          price: item.sale_price,
          aiPricingEnabled: item.ai_pricing_enabled,
          stock: item.stock_qty,
          saleStatus: mapSaleStatusLabel(item.sale_status),
          saleStatusCode: item.sale_status,
          updatedAt: formatUpdatedAt(item.updated_at),
        }));

        setProducts(mappedItems);

        setSummary({
          totalCount: data.summary?.total_count || 0,
          saleCount: data.summary?.sale_count || 0,
          soldOutCount: data.summary?.sold_out_count || 0,
          aiEnabledCount: data.summary?.ai_enabled_count || 0,
          totalDiff: data.summary?.total_diff || 0,
          saleDiff: data.summary?.sale_diff || 0,
          soldOutDiff: data.summary?.sold_out_diff || 0,
          aiEnabledDiff: data.summary?.ai_enabled_diff || 0,
        });
      } catch (error) {
        console.error(error);
        setProducts([]);
        alert(
          error?.response?.data?.detail || "상품 목록 조회에 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchValue, categoryValue, startDate, endDate, reloadTick]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(products.length / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [products.length, pageSize, page]);

  const handleToggleAiPricing = async (id, nextChecked) => {
    const previousProducts = products;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, aiPricingEnabled: nextChecked } : item,
      ),
    );

    try {
      await updateAdminProductAiPricing(id, nextChecked);
      setReloadTick((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setProducts(previousProducts);
      alert(
        error?.response?.data?.detail ||
          "AI 가격변경 상태 변경에 실패했습니다.",
      );
    }
  };

  const handleChangeSaleStatus = async (id, nextStatusCode) => {
    const previousProducts = products;
    const nextStatusLabel = mapSaleStatusLabel(nextStatusCode);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              saleStatusCode: nextStatusCode,
              saleStatus: nextStatusLabel,
            }
          : item,
      ),
    );

    try {
      await updateAdminProductSaleStatus(id, nextStatusCode);
      setReloadTick((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setProducts(previousProducts);
      alert(error?.response?.data?.detail || "판매상태 변경에 실패했습니다.");
    }
  };

  const columns = [
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
          href={`/product-detail?productCode=${row.productCode}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </ProductNameLink>
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
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "aiPricingEnabled",
      title: "AI 가격변경",
      width: "120px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            onChange={(nextChecked) =>
              handleToggleAiPricing(row.id, nextChecked)
            }
          />
        </CenterCell>
      ),
    },
    {
      key: "stock",
      title: "재고",
      width: "90px",
      sortType: "number",
      render: (value) => `${Number(value).toLocaleString()}개`,
    },
    {
      key: "saleStatus",
      title: "판매상태",
      width: "120px",
      sortable: false,
      render: (_, row) => (
        <CenterCell>
          <StatusBadge
            value={row.saleStatus}
            mode="select"
            options={saleStatusOptions}
            onChange={(nextValue) => handleChangeSaleStatus(row.id, nextValue)}
            width="96px"
          />
        </CenterCell>
      ),
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
      <Title>상품 목록</Title>

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          value={
            <>
              {summary.totalCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summary.totalDiff)} SKU`}
          up={summary.totalDiff >= 0}
        />

        <SummaryCard
          title="판매 중"
          value={
            <>
              {summary.saleCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summary.saleDiff)} SKU`}
          up={summary.saleDiff >= 0}
        />

        <SummaryCard
          title="품절"
          value={
            <>
              {summary.soldOutCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summary.soldOutDiff)} SKU`}
          up={summary.soldOutDiff >= 0}
        />

        <SummaryCard
          title="AI 가격변경"
          value={
            <>
              {summary.aiEnabledCount}
              <span>SKU</span>
            </>
          }
          change={`${Math.abs(summary.aiEnabledDiff)} SKU`}
          up={summary.aiEnabledDiff >= 0}
        />
      </SummaryGrid>

      <TableComponent
        columns={columns}
        data={products}
        headerAlign="center"
        cellAlign="center"
        rowKey="id"
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
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
        searchPlaceholder="상품명, 상품코드로 검색"
        filterValue={categoryValue}
        onFilterChange={(value) => {
          setCategoryValue(value);
          setPage(1);
        }}
        filterPlaceholder="전체"
        filterOptions={categoryOptions}
        toolbarRight={
          <PrimaryButton
            type="button"
            onClick={() => nav("/admin/product-regist")}
          >
            <Plus size={15} />
            상품등록
          </PrimaryButton>
        }
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

const PrimaryButton = styled.button`
  height: 35px;
  min-width: 100px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  & svg {
    color: white;
  }
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

const ProductNameLink = styled.a`
  display: block;
  min-width: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const SubText = styled.span`
  color: var(--font);
  font-size: 12px;
`;

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CodeLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;