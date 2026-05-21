import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";
import SummaryCard from "../../../components/SummaryCard";
import {
  getAdminInventoryHistoryList,
  getAdminInventoryHistorySummary,
} from "../../../api/adminInventory";

const movementTypeOptions = [
  { label: "입고", value: "INBOUND" },
  { label: "출고", value: "ORDER_OUT" },
];

const weekLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const formatCount = (value) =>
  `${Math.abs(Number(value || 0)).toLocaleString()}개`;

const formatMovementByType = (value, changeType) => {
  const qty = Math.abs(Number(value || 0));

  if (changeType === "INBOUND") {
    return `+${qty.toLocaleString()}개`;
  }

  if (changeType === "ORDER_OUT") {
    return `-${qty.toLocaleString()}개`;
  }

  return `${Number(value || 0) > 0 ? "+" : ""}${Number(
    value || 0,
  ).toLocaleString()}개`;
};

const getChartScale = (...datasets) => {
  const flatValues = datasets.flat().map((value) => Number(value || 0));
  const max = Math.max(...flatValues, 0);
  const min = Math.min(...flatValues, 0);
  const range = max - min || 1;

  return { max, min, range };
};

const buildPolylinePoints = (values, width, height, padding = 12, scale) => {
  const { min, range } = scale;

  return values
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y =
        height - padding - ((value - min) * (height - padding * 2)) / range;
      return `${x},${y}`;
    })
    .join(" ");
};

const buildChartPoints = (values, width, height, padding = 12, scale) => {
  const { min, range } = scale;

  return values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y =
      height - padding - ((value - min) * (height - padding * 2)) / range;

    return { x, y, value };
  });
};

const formatOccurredAt = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
};

const buildCurrentWeekMeta = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return weekLabels.map((label, index) => {
    const start = new Date(sunday);
    start.setDate(sunday.getDate() + index);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return {
      label,
      start,
      end,
    };
  });
};

const buildWeeklyTrend = (rows, targetType, weekMeta) => {
  return weekMeta.map(({ start, end }) =>
    rows
      .filter((row) => row.changeType === targetType)
      .filter((row) => {
        const occurredAt = new Date(row.occurredAt);
        if (Number.isNaN(occurredAt.getTime())) return false;
        return occurredAt >= start && occurredAt < end;
      })
      .reduce((acc, row) => acc + Math.abs(Number(row.movementQty || 0)), 0),
  );
};

const getMsUntilNextMidnight = () => {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.getTime() - now.getTime();
};

const defaultSummaryData = {
  total_count: 0,
  total_diff: 0,
  inbound_sku_count: 0,
  inbound_qty: 0,
  inbound_sku_diff: 0,
  inbound_qty_diff: 0,
  outbound_sku_count: 0,
  outbound_qty: 0,
  outbound_sku_diff: 0,
  outbound_qty_diff: 0,
};

const mapHistoryRows = (items) =>
  Array.isArray(items)
    ? items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productCode: item.product_code,
        productName: item.product_name,
        type: item.change_type_label,
        changeType: item.change_type,
        baseStock: Number(item.qty_before ?? 0),
        movementQty: Number(item.change_qty ?? 0),
        resultStock: Number(item.qty_after ?? 0),
        date: formatOccurredAt(item.occurred_at),
        occurredAt: item.occurred_at,
        note: item.note || "-",
      }))
    : [];

export default function InventoryHistory() {
  const nav = useNavigate();
  const chartAreaRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [trendRows, setTrendRows] = useState([]);
  const [summaryData, setSummaryData] = useState(defaultSummaryData);
  const [currentWeekMeta, setCurrentWeekMeta] = useState(() =>
    buildCurrentWeekMeta(),
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearchValue, setDebounceSearchValue] = useState("");
  const [movementType, setMovementType] = useState("");  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebounceSearchValue(searchValue);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue])

  const fetchInventoryHistory = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [trendResponse, historyResponse, summaryResponse] =
        await Promise.all([
          getAdminInventoryHistoryList(),
          getAdminInventoryHistoryList({
            keyword: debounceSearchValue.trim() || undefined,
            change_type: movementType || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          }),
          getAdminInventoryHistorySummary(),
        ]);

      const mappedTrendRows = mapHistoryRows(trendResponse?.items);
      const mappedRows = mapHistoryRows(historyResponse?.items);

      setTrendRows(mappedTrendRows);
      setRows(mappedRows);
      setSummaryData(summaryResponse || defaultSummaryData);
      setPage(1);
    } catch (error) {
      console.error("재고 변동 이력 조회 실패", error);
      setRows([]);
      setTrendRows([]);
      setSummaryData(defaultSummaryData);
      setErrorMessage("재고 변동 이력을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [debounceSearchValue, movementType, startDate, endDate]);

  useEffect(() => {
    fetchInventoryHistory();
  }, [fetchInventoryHistory]);

  useEffect(() => {
    let timeoutId = null;
    let cancelled = false;

    const scheduleNextRefresh = () => {
      const delay = getMsUntilNextMidnight();

      timeoutId = window.setTimeout(async () => {
        if (cancelled) return;

        setCurrentWeekMeta(buildCurrentWeekMeta());
        await fetchInventoryHistory();

        if (!cancelled) {
          scheduleNextRefresh();
        }
      }, delay);
    };

    scheduleNextRefresh();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [fetchInventoryHistory]);

  const inboundTrend = useMemo(
    () => buildWeeklyTrend(trendRows, "INBOUND", currentWeekMeta),
    [trendRows, currentWeekMeta],
  );

  const outboundTrend = useMemo(
    () => buildWeeklyTrend(trendRows, "ORDER_OUT", currentWeekMeta),
    [trendRows, currentWeekMeta],
  );

  const chartScale = useMemo(
    () => getChartScale(inboundTrend, outboundTrend),
    [inboundTrend, outboundTrend],
  );

  const inboundPoints = useMemo(
    () => buildChartPoints(inboundTrend, 260, 96, 10, chartScale),
    [inboundTrend, chartScale],
  );

  const outboundPoints = useMemo(
    () => buildChartPoints(outboundTrend, 260, 96, 10, chartScale),
    [outboundTrend, chartScale],
  );

  const tooltipData =
    hoveredIndex !== null
      ? {
          label: weekLabels[hoveredIndex],
          inbound: inboundTrend[hoveredIndex] ?? 0,
          outbound: outboundTrend[hoveredIndex] ?? 0,
        }
      : null;

  const formatHistoryChange = (skuDiff, qtyDiff) => {
    const sku = Math.abs(Number(skuDiff || 0));
    const qty = Math.abs(Number(qtyDiff || 0));

    if (sku === 0 && qty === 0) return "-";

    return `${sku} SKU / ${qty.toLocaleString()}개`;
  };

  const isNoHistoryChange = (skuDiff, qtyDiff) =>
    Number(skuDiff || 0) === 0 && Number(qtyDiff || 0) === 0;

  const isInboundNoChange = isNoHistoryChange(
    summaryData.inbound_sku_diff,
    summaryData.inbound_qty_diff,
  );

  const isOutboundNoChange = isNoHistoryChange(
    summaryData.outbound_sku_diff,
    summaryData.outbound_qty_diff,
  );

  const isInboundUp =
    Number(summaryData.inbound_sku_diff || 0) >= 0 &&
    Number(summaryData.inbound_qty_diff || 0) >= 0;

  const isOutboundUp =
    Number(summaryData.outbound_sku_diff || 0) >= 0 &&
    Number(summaryData.outbound_qty_diff || 0) >= 0;

  const handleChartMouseMove = (e) => {
    if (!chartAreaRef.current) return;

    const rect = chartAreaRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(relativeX, rect.width));
    const sectionWidth = rect.width / weekLabels.length;
    const index = Math.min(
      weekLabels.length - 1,
      Math.max(0, Math.floor(clampedX / sectionWidth)),
    );

    setHoveredIndex(index);
    setTooltipPosition({
      x: sectionWidth * index + sectionWidth / 2,
      y: 8,
    });
  };

  const handleChartMouseLeave = () => {
    setHoveredIndex(null);
  };

  const columns = [
    {
      key: "productCode",
      title: "상품코드",
      width: "100px",
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
      key: "type",
      title: "구분",
      width: "90px",
      sortable: false,
      align: "center",
      render: (value) => <TypeBadge $type={value}>{value}</TypeBadge>,
    },
    {
      key: "productName",
      title: "상품명",
      width: "260px",
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
      key: "baseStock",
      title: "기존재고",
      width: "110px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "movementQty",
      title: "입출고수량",
      width: "120px",
      sortType: "number",
      render: (value, row) => (
        <QuantityText $positive={row.changeType === "INBOUND"}>
          {formatMovementByType(value, row.changeType)}
        </QuantityText>
      ),
    },
    {
      key: "resultStock",
      title: "반영재고",
      width: "110px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "date",
      title: "일자",
      width: "140px",
      sortValue: (row) => row.occurredAt,
      render: (value) => <SubText>{value}</SubText>,
    },
    {
      key: "note",
      title: "비고",
      width: "220px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <Title>입출고 이력 조회</Title>

      <SummaryGrid>
        <SummaryCard
          title="입고"
          value={
            <>
              {summaryData.inbound_sku_count}
              <span>SKU / {summaryData.inbound_qty.toLocaleString()}개</span>
            </>
          }
          change={
            isInboundNoChange
              ? "-"
              : formatHistoryChange(
                  summaryData.inbound_sku_diff,
                  summaryData.inbound_qty_diff,
                )
          }
          up={isInboundUp}
        />

        <SummaryCard
          title="출고"
          value={
            <>
              {summaryData.outbound_sku_count}
              <span>SKU / {summaryData.outbound_qty.toLocaleString()}개</span>
            </>
          }
          change={
            isOutboundNoChange
              ? "-"
              : formatHistoryChange(
                  summaryData.outbound_sku_diff,
                  summaryData.outbound_qty_diff,
                )
          }
          up={isOutboundUp}
        />

        <TrendCard>
          <TrendHeader>입출고 추이</TrendHeader>

          <TrendInner>
            <LegendArea>
              <LegendItem>
                <LegendDot $color="var(--blue)" />
                입고
              </LegendItem>
              <LegendItem>
                <LegendDot $color="var(--red)" />
                출고
              </LegendItem>
            </LegendArea>

            <ChartArea
              ref={chartAreaRef}
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartMouseLeave}
            >
              {tooltipData ? (
                <ChartTooltip
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                  }}
                >
                  <TooltipTitle>{tooltipData.label}</TooltipTitle>
                  <TooltipRow>
                    <TooltipLabel>
                      <LegendDot $color="var(--blue)" />
                      입고
                    </TooltipLabel>
                    <TooltipValue>
                      {tooltipData.inbound.toLocaleString()}개
                    </TooltipValue>
                  </TooltipRow>
                  <TooltipRow>
                    <TooltipLabel>
                      <LegendDot $color="var(--red)" />
                      출고
                    </TooltipLabel>
                    <TooltipValue>
                      {tooltipData.outbound.toLocaleString()}개
                    </TooltipValue>
                  </TooltipRow>
                </ChartTooltip>
              ) : null}

              <TrendSvg viewBox="0 0 260 96" preserveAspectRatio="none">
                {hoveredIndex !== null ? (
                  <HoverGuide
                    x1={inboundPoints[hoveredIndex]?.x ?? 0}
                    x2={inboundPoints[hoveredIndex]?.x ?? 0}
                    y1="0"
                    y2="96"
                  />
                ) : null}

                <polyline
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildPolylinePoints(
                    inboundTrend,
                    260,
                    96,
                    10,
                    chartScale,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="var(--red)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildPolylinePoints(
                    outboundTrend,
                    260,
                    96,
                    10,
                    chartScale,
                  )}
                />

                {inboundPoints.map((point, index) => (
                  <circle
                    key={`inbound-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index ? 3 : 0}
                    fill="var(--blue)"
                  />
                ))}

                {outboundPoints.map((point, index) => (
                  <circle
                    key={`outbound-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index ? 3 : 0}
                    fill="var(--red)"
                  />
                ))}
              </TrendSvg>

              <XAxis>
                {weekLabels.map((label, index) => (
                  <XAxisLabel
                    key={`${label}-${index}`}
                    $active={hoveredIndex === index}
                  >
                    {label}
                  </XAxisLabel>
                ))}
              </XAxis>
            </ChartArea>
          </TrendInner>
        </TrendCard>
      </SummaryGrid>

      {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}

      <TableComponent
        columns={columns}
        data={rows}
        headerAlign="center"
        cellAlign="center"
        rowKey="id"
        // 검색바
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(1);
        }}
        searchPlaceholder="상품명, 상품코드, 비고 검색"
        // 날짜
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
        // 입출고 구분
        filterValue={movementType}
        onFilterChange={(val) => {
          setMovementType(val);
          setPage(1);
        }}
        filterOptions={movementTypeOptions}
        filterPlaceholder="입출고 구분 전체"
        // 페이지네이션
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {loading ? <LoadingText>불러오는 중...</LoadingText> : null}
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
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: var(--shadow);
`;

const CardTitle = styled.p`
  margin: 0 0 14px;
  color: var(--font);
  font-size: 15px;
  font-weight: 700;
`;

const BigLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const BigNumber = styled.span`
  color: var(--font);
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
`;

const Unit = styled.span`
  color: var(--font);
  font-size: 18px;
  font-weight: 700;
`;

const Slash = styled.span`
  color: var(--placeholder);
  font-size: 18px;
  font-weight: 700;
`;

const SubNumber = styled.span`
  color: var(--font);
  font-size: 16px;
  font-weight: 700;
`;

const ChangeRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $neutral, $up }) =>
    $neutral ? "var(--placeholder);" : $up ? "var(--green);" : "var(--red);"};
  font-size: 12px;
  font-weight: 700;
`;

const ChangeArrow = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const ChangeMuted = styled.span`
  margin-left: 2px;
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 500;
`;

const TrendCard = styled(StatCard)`
  background: white;
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrendHeader = styled.div`
  margin-bottom: 14px;
  color: var(--font);
  font-size: 16px;
  font-weight: 700;
`;

const TrendInner = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
`;

const LegendArea = styled.div`
  display: flex;
  height: 100px;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ChartArea = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TrendSvg = styled.svg`
  width: 100%;
  height: 70px;
  overflow: visible;
`;

const HoverGuide = styled.line`
  stroke: #cbd5e1;
  stroke-width: 1;
  stroke-dasharray: 4 4;
`;

const ChartTooltip = styled.div`
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -100%);
  min-width: 120px;
  padding: 10px 12px;
  border-radius: 12px;
  background: white;
  color: var(--font);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  pointer-events: none;
`;

const TooltipTitle = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  & + & {
    margin-top: 6px;
  }
`;

const TooltipLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const TooltipValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const XAxis = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 8px;
  color: var(--placeholder);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
`;

const XAxisLabel = styled.span`
  color: ${({ $active }) => ($active ? "var(--font)" : "var(--placeholder)")};
  font-weight: ${({ $active }) => ($active ? 800 : 700)};
`;

const CustomToolbar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const CodeLink = styled.button`
  border: 0;
  padding: 0;
  background: none;
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: var(--blue);
    text-decoration: underline;
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

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $type }) => {
    if ($type === "입고") return "#1d4ed8";
    if ($type === "출고") return "#b91c1c";
    return "#92400e";
  }};
  background: ${({ $type }) => {
    if ($type === "입고") return "#dbeafe";
    if ($type === "출고") return "#fee2e2";
    return "#fef3c7";
  }};
`;

const QuantityText = styled.span`
  color: ${({ $positive }) => ($positive ? "#2563eb" : "#ef4444")};
  font-size: 13px;
  font-weight: 700;
`;

const SubText = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const ErrorText = styled.div`
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
`;

const LoadingText = styled.div`
  margin-top: 12px;
  color: #6b7280;
  font-size: 13px;
`;
