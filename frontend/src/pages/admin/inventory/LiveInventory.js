import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import { Plus } from "lucide-react";
import InboundRegisterModal from "./InboundRegisterModal";
import {
  getAdminLiveInventoryList,
  getAdminLiveInventorySummary,
  patchAdminLiveInventoryRow,
  createAdminInbound,
} from "../../../api/adminInventory";

const inventoryStatusOptions = [
  { label: "안전재고", value: "안전재고" },
  { label: "발주권고", value: "발주권고" },
  { label: "일시품절", value: "일시품절" },
  { label: "악성재고", value: "악성재고" },
];

const salesStatusOptions = [
  { label: "판매중", value: "판매중" },
  { label: "판매중지", value: "판매중지" },
  { label: "품절", value: "품절" },
  { label: "판매종료", value: "판매종료" },
  { label: "판매예정", value: "판매예정" },
];

const saleStatusLabelMap = {
  ON_SALE: "판매중",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
  READY: "판매예정",
};

const formatNumber = (value) => `${Number(value || 0).toLocaleString()}원`;
const formatCount = (value) => `${Number(value || 0).toLocaleString()}개`;

const mapInventoryRow = (item) => ({
  id: item.id,
  productCode: item.product_code,
  productName: item.product_name ?? "-",
  totalStock: Number(item.total_stock ?? 0),
  availableStock: Number(item.available_stock ?? 0),
  safetyStock: Number(item.safety_stock_qty ?? 0),
  inventoryStatus: item.inventory_status ?? "안전재고",
  purchasePrice: Number(item.purchase_price ?? 0),
  assetAmount: Number(item.asset_amount ?? 0),
  salesStatusCode: item.sale_status ?? "ON_SALE",
  salesStatus: saleStatusLabelMap[item.sale_status] ?? item.sale_status ?? "-",
  category: item.category ?? "-",
});

const defaultSummaryData = {
  total_count: 0,
  total_diff: 0,
};

export default function LiveInventory() {
  const nav = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [inventoryValue, setInventoryValue] = useState("");
  const [salesValue, setSalesValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [summaryData, setSummaryData] = useState(defaultSummaryData);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const [isInboundModalOpen, setIsInboundModalOpen] = useState(false);
  const [isInboundSubmitting, setIsInboundSubmitting] = useState(false);

  const fetchRows = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [listResponse, summaryResponse] = await Promise.all([
        getAdminLiveInventoryList(),
        getAdminLiveInventorySummary(),
      ]);

      const items = Array.isArray(listResponse)
        ? listResponse
        : (listResponse?.items ?? []);

      setRows(items.map(mapInventoryRow));
      setSummaryData(summaryResponse || defaultSummaryData);
    } catch (error) {
      console.error(error);
      setRows([]);
      setSummaryData(defaultSummaryData);
      setErrorMessage(
        error?.response?.data?.detail ||
        "실시간 재고 목록을 불러오지 못했습니다.",
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

  const handleSalesStatusChange = async (productCode, nextStatusCode) => {
    const actionKey = `${productCode}:status`;
    const previousRows = rows;

    try {
      setPendingActionKey(actionKey);

      setRows((prev) =>
        prev.map((item) =>
          item.productCode === productCode
            ? {
              ...item,
              salesStatusCode: nextStatusCode,
              salesStatus:
                saleStatusLabelMap[nextStatusCode] ?? nextStatusCode,
            }
            : item,
        ),
      );

      await patchAdminLiveInventoryRow(productCode, {
        sale_status: nextStatusCode,
      });
    } catch (error) {
      console.error(error);
      setRows(previousRows);
      alert(error?.response?.data?.detail || "판매상태 변경에 실패했습니다.");
    } finally {
      setPendingActionKey("");
    }
  };

  const handleSubmitInbound = async ({
    productCode,
    inboundQty,
    expirationDate,
  }) => {
    try {
      setIsInboundSubmitting(true);

      await createAdminInbound({
        product_code: productCode,
        inbound_qty: Number(inboundQty),
        expiration_date: expirationDate,
      });

      alert("입고 등록이 완료되었습니다.");
      setIsInboundModalOpen(false);
      await fetchRows();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "입고 등록에 실패했습니다.");
    } finally {
      setIsInboundSubmitting(false);
    }
  };

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      salesSummary: {
        판매중: rows.filter((item) => item.salesStatus === "판매중").length,
        판매중지: rows.filter((item) => item.salesStatus === "판매중지").length,
        품절: rows.filter((item) => item.salesStatus === "품절").length,
        판매종료: rows.filter((item) => item.salesStatus === "판매종료").length,
      },
      inventorySummary: {
        안전재고: rows.filter((item) => item.inventoryStatus === "안전재고")
          .length,
        발주권고: rows.filter((item) => item.inventoryStatus === "발주권고")
          .length,
        일시품절: rows.filter((item) => item.inventoryStatus === "일시품절")
          .length,
      },
      warningItems: rows
        .filter((item) => item.inventoryStatus === "발주권고")
        .slice(0, 3),
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return rows.filter((item) => {
      const matchKeyword =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.productCode.toLowerCase().includes(q);

      const matchCategory = categoryValue
        ? item.category === categoryValue
        : true;

      const matchInventory = inventoryValue
        ? item.inventoryStatus === inventoryValue
        : true;

      const matchSales = salesValue ? item.salesStatus === salesValue : true;

      return matchKeyword && matchCategory && matchInventory && matchSales;
    });
  }, [rows, keyword, categoryValue, inventoryValue, salesValue]);

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
      key: "totalStock",
      title: "총재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "availableStock",
      title: "가용재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "safetyStock",
      title: "안전재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "inventoryStatus",
      title: "재고상태",
      width: "110px",
      sortable: false,
      render: (value) => (
        <InventoryStatusBadge $type={value}>{value}</InventoryStatusBadge>
      ),
    },
    {
      key: "purchasePrice",
      title: "재고원가",
      width: "110px",
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "assetAmount",
      title: "재고자산액",
      width: "120px",
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "salesStatus",
      title: "판매상태",
      width: "120px",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <StatusBadge
            value={value}
            mode="select"
            width="96px"
            disabled={pendingActionKey === `${row.productCode}:status`}
            options={salesStatusOptions.map((opt) => ({
              ...opt,
              value: Object.keys(saleStatusLabelMap).find(
                (key) => saleStatusLabelMap[key] === opt.value,
              ),
            }))}
            onChange={(nextValue) =>
              handleSalesStatusChange(row.productCode, nextValue)
            }
          />
        </CenterCell>
      ),
    },
  ];

  const isTotalUp = Number(summaryData.total_diff || 0) >= 0;

  return (
    <>
      <PageWrap>
        <Title>실시간 재고 현황</Title>

        {isLoading && (
          <PageStatusText>실시간 재고 목록을 불러오는 중입니다.</PageStatusText>
        )}
        {!isLoading && errorMessage && (
          <PageStatusText $error>{errorMessage}</PageStatusText>
        )}

        <SummaryGrid>
          <SummaryCardBox>
            <CardTitle>전체 재고 수</CardTitle>
            <CardValueWrap>
              <CardValue>{summaryData.total_count}</CardValue>
              <CardUnit>SKU</CardUnit>
            </CardValueWrap>
            <CardChangeRow $up={isTotalUp}>
              <ChangeArrow>{isTotalUp ? "↑" : "↓"}</ChangeArrow>
              <span>{Math.abs(summaryData.total_diff)} SKU</span>
              <ChangeMuted>vs Yesterday</ChangeMuted>
            </CardChangeRow>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardTitle>판매 상태별</CardTitle>
            <SummaryList>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="green" />
                  판매중
                </SummaryLabel>
                <SummaryValue>
                  {summary.salesSummary["판매중"]} SKU
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="yellow" />
                  판매중지
                </SummaryLabel>
                <SummaryValue>
                  {summary.salesSummary["판매중지"]} SKU
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="pink" />
                  품절
                </SummaryLabel>
                <SummaryValue>{summary.salesSummary["품절"]} SKU</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="indigo" />
                  판매종료
                </SummaryLabel>
                <SummaryValue>
                  {summary.salesSummary["판매종료"]} SKU
                </SummaryValue>
              </SummaryRow>
            </SummaryList>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardTitle>재고 상태별</CardTitle>
            <SummaryList>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="green" />
                  안전재고
                </SummaryLabel>
                <SummaryValue>
                  {summary.inventorySummary["안전재고"]} SKU
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="yellow" />
                  발주권고
                </SummaryLabel>
                <SummaryValue>
                  {summary.inventorySummary["발주권고"]} SKU
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  <Dot $color="pink" />
                  일시품절
                </SummaryLabel>
                <SummaryValue>
                  {summary.inventorySummary["일시품절"]} SKU
                </SummaryValue>
              </SummaryRow>
            </SummaryList>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardHeaderRow>
              <CardTitle>발주 권고</CardTitle>
              <CardRightValue>
                {summary.inventorySummary["발주권고"]} SKU
              </CardRightValue>
            </CardHeaderRow>

            <WarningHeader>
              <span>재고 부족 예상</span>
              <span>현 재고</span>
            </WarningHeader>

            <WarningList>
              {summary.warningItems.length > 0 ? (
                summary.warningItems.map((row) => (
                  <WarningItem key={row.id}>
                    <WarningName>{row.productName}</WarningName>
                    <WarningStock>
                      {formatCount(row.availableStock)}
                    </WarningStock>
                  </WarningItem>
                ))
              ) : (
                <WarningEmpty>발주 권고 대상이 없습니다.</WarningEmpty>
              )}
            </WarningList>
          </SummaryCardBox>
        </SummaryGrid>

        <TableComponent
          columns={columns}
          data={filteredData}
          headerAlign="center"
          cellAlign="center"
          rowKey="id"
          // 검색
          searchValue={keyword}
          onSearchChange={(val) => {
            setKeyword(val);
            setPage(1);
          }}
          searchPlaceholder="상품명, 상품코드로 검색"
          // 재고상태별
          filterValue={inventoryValue}
          onFilterChange={(val) => {
            setInventoryValue(val);
            setPage(1);
          }}
          filterPlaceholder="재고상태 전체"
          filterOptions={inventoryStatusOptions}
          // 판매상태별
          filterValue2={salesValue}
          onFilterChange2={(val) => {
            setSalesValue(val);
            setPage(1);
          }}
          filterPlaceholder2="판매상태 전체"
          filterOptions2={salesStatusOptions}
          // 카테고리별
          filterValue3={categoryValue}
          onFilterChange3={(val) => {
            setCategoryValue(val);
            setPage(1);
          }}
          filterPlaceholder3="카테고리 전체"
          filterOptions3={categoryOptions}
          toolbarRight={
            <InboundButton
              type="button"
              onClick={() => setIsInboundModalOpen(true)}
            >
              <Plus size={15} />
              입고등록
            </InboundButton>
          }
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </PageWrap>

      <InboundRegisterModal
        open={isInboundModalOpen}
        onClose={() => {
          if (isInboundSubmitting) return;
          setIsInboundModalOpen(false);
        }}
        onSubmit={handleSubmitInbound}
        isSubmitting={isInboundSubmitting}
      />
    </>
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
  color: ${({ $error }) => ($error ? "#dc2626" : "#475569")};
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

const SummaryCardBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px;
  min-height: 118px;
  box-shadow: var(--shadow);
  box-sizing: border-box;
`;

const CardTitle = styled.div`
  color: var(--font);
  font-size: 14px;
  font-weight: 700;
`;

const CardValueWrap = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const CardValue = styled.div`
  color: var(--font);
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
`;

const CardUnit = styled.span`
  color: var(--font);
  font-size: 18px;
  font-weight: 700;
`;

const CardChangeRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $up }) => ($up ? "var(--green)" : "var(--red)")};
  font-size: 14px;
  font-weight: 700;
`;

const ChangeArrow = styled.span`
  font-size: 14px;
  line-height: 1;
`;

const ChangeMuted = styled.span`
  margin-left: 4px;
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const SummaryList = styled.div`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SummaryLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--font);
  font-size: 14px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  color: var(--font);
  font-size: 14px;
  font-weight: 700;
`;

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $color }) => {
    if ($color === "green") return "var(--green)";
    if ($color === "yellow") return "var(--yellow)";
    if ($color === "pink") return "var(--purple)";
    if ($color === "indigo") return "var(--violet)";
    return "#cbd5e1";
  }};
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CardRightValue = styled.div`
  color: var(--font);
  font-size: 14px;
  font-weight: 800;
`;

const WarningHeader = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 700;
`;

const WarningList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const WarningName = styled.div`
  flex: 1;
  min-width: 0;
  color: var(--font);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const WarningStock = styled.div`
  color: var(--font);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

const WarningEmpty = styled.div`
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const InboundButton = styled.button`
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
`;

const CodeLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--blue);
  }
`;

const ProductNameLink = styled.a`
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const CenterCell = styled.div`
  display: flex;
  justify-content: center;
`;

const InventoryStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  ${({ $type }) => {
    if ($type === "안전재고") {
      return `
        background: #dcfce7;
        color: var(--green);
      `;
    }

    if ($type === "발주권고") {
      return `
        background: #fef3c7;
        color: var(--yellow);
      `;
    }

    if ($type === "일시품절") {
      return `
        background: #f3e8ff;
        color: var(--purple);
      `;
    }

    if ($type === "악성재고") {
      return `
    background: #fee2e2;
    color: var(--red);
  `;
    }

    return `
      background: #e5e7eb;
      color: var(--placeholder);
    `;
  }}
`;
