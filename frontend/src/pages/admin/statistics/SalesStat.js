import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { CalendarDays, AlertTriangle, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  BarChart,
  Bar,
} from "recharts";
import RateBadge from "../../../components/RateBadge";
import SearchDate from "../../../components/SearchDate";
import SelectBar from "../../../components/SelectBar";
import SummaryCard from "../../../components/SummaryCard";
import SearchBar from "../../../components/SearchBar";

import { getAdminSalesStat } from "../../../api/stats";

const MODE_OPTIONS = [
  { key: "all", label: "전체" },
  { key: "ai", label: "AI 가격변경" },
  { key: "manual", label: "수동 가격변경" },
];

const PERIOD_OPTIONS = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

const RANKING_TYPE_OPTIONS = [
  { value: "sales", label: "판매량순" },
  { value: "revenue", label: "매출" },
  { value: "profit", label: "공헌이익" },
  { value: "drop", label: "하락폭순" },
];

const CATEGORY_COLORS = {
  라면: "#2563eb",
  소시지: "#38bdf8",
  스낵과자: "#fbbf24",
  즉석식품: "#22c55e",
  카레: "#a855f7",
  탄산음료: "#ef4444",
};

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function formatCurrency(value) {
  return `${formatNumber(Math.round(value || 0))}원`;
}

function formatCount(value) {
  return `${formatNumber(Math.round(value || 0))}개`;
}

function formatPercent(value) {
  const numeric = Number(value || 0);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}%`;
}

function formatAxisToMan(value) {
  if (!value) return "0";
  return `${Math.round(value / 10000)}만`;
}

export default function SalesStat() {
  const nav = useNavigate();

  const [mode, setMode] = useState("all");
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [trendCategory, setTrendCategory] = useState("");
  const [productMixCategory, setProductMixCategory] = useState("");

  const [hourlyDate, setHourlyDate] = useState("");
  const [hourlyKeyword, setHourlyKeyword] = useState("");

  const [rankingType, setRankingType] = useState("sales");
  const [rankingCategory, setRankingCategory] = useState("전체");
  const [rankingPeriod, setRankingPeriod] = useState("weekly");

  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        const data = await getAdminSalesStat({
          mode,
          period,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          trend_category: trendCategory || undefined,
          product_mix_category: productMixCategory || undefined,
          hourly_keyword: hourlyKeyword || undefined,
          hourly_date: hourlyDate || undefined,
          ranking_type: rankingType,
          ranking_category: rankingCategory,
          ranking_period: rankingPeriod,
        });

        setDashboard(data);

        const categoryOptions = data.category_options || [];

        if (categoryOptions.length > 0) {
          if (!trendCategory || !categoryOptions.includes(trendCategory)) {
            setTrendCategory(categoryOptions[0]);
          }
          if (
            !productMixCategory ||
            !categoryOptions.includes(productMixCategory)
          ) {
            setProductMixCategory(categoryOptions[0]);
          }
        }
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.detail || "판매 현황 조회에 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [
    mode,
    period,
    startDate,
    endDate,
    trendCategory,
    productMixCategory,
    hourlyKeyword,
    hourlyDate,
    rankingType,
    rankingCategory,
    rankingPeriod,
  ]);

  const categoryOptions = dashboard?.category_options || [];

  const summary = useMemo(() => {
    const source = dashboard?.summary;
    if (!source) {
      return {
        compareLabel: "전주 대비",
        cards: [],
      };
    }

    return {
      compareLabel: source.compare_label || "전주 대비",
      cards: [
        {
          title: "기간 총 매출액(GMV)",
          value: formatNumber(source.gmv),
          suffix: "원",
          change: source.gmv_change_rate,
        },
        {
          title: "기간 총 판매량",
          value: formatNumber(source.sales_volume),
          suffix: "개",
          change: source.sales_volume_change_rate,
        },
        {
          title: "기간 총 공헌이익",
          value: formatNumber(source.contribution_profit),
          suffix: "원",
          change: source.contribution_profit_change_rate,
        },
        {
          title: "평균 공헌이익률",
          value: Number(source.avg_contribution_margin || 0).toFixed(1),
          suffix: "%",
          change: source.avg_contribution_margin_change_rate,
        },
      ],
    };
  }, [dashboard]);

  const categoryTrendData = dashboard?.category_trend || [];

  const categoryShareData = useMemo(() => {
    return (dashboard?.category_share || []).map((item) => ({
      ...item,
      color: CATEGORY_COLORS[item.name] || "#9ca3af",
    }));
  }, [dashboard]);

  const hourlySelectedProduct = {
    productCode: dashboard?.hourly?.product_code || "",
    productName: dashboard?.hourly?.product_name || "",
  };

  const hourlyChartData = (dashboard?.hourly?.items || []).map((item) => ({
    time: item.time,
    lowestPrice: item.lowest_price,
    myPrice: item.my_price,
    sales: item.sales,
    profit: item.profit,
  }));

  const inventoryRows = dashboard?.bad_inventory || [];
  const productMixData = dashboard?.product_mix || [];
  const rankingRows = dashboard?.ranking?.items || [];
  const rankingCompareLabel = dashboard?.ranking?.compare_label || "전주 대비";

  const rankingColumns = useMemo(() => {
    const common = [
      { key: "rank", label: "순위", width: "60px" },
      { key: "productCode", label: "상품코드", width: "120px", isLink: true },
      { key: "productName", label: "상품명", width: "230px" },
      { key: "category", label: "카테고리", width: "120px" },
    ];

    if (rankingType === "sales") {
      return [
        ...common,
        {
          key: "sales",
          label: "판매량",
          width: "100px",
          formatter: formatCount,
        },
        {
          key: "avgSales",
          label: "일평균판매량",
          width: "120px",
          formatter: formatCount,
        },
        {
          key: "compareRate",
          label: rankingCompareLabel,
          width: "110px",
          isDelta: true,
        },
        {
          key: "avgPrice",
          label: "평균판매가",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgProfit",
          label: "평균이익",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgMargin",
          label: "평균이익률",
          width: "100px",
          formatter: (v) => `${v}%`,
        },
      ];
    }

    if (rankingType === "revenue") {
      return [
        ...common,
        {
          key: "revenue",
          label: "매출",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgRevenue",
          label: "일평균매출",
          width: "120px",
          formatter: formatCurrency,
        },
        {
          key: "compareRate",
          label: rankingCompareLabel,
          width: "110px",
          isDelta: true,
        },
        {
          key: "avgPrice",
          label: "평균판매가",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgProfit",
          label: "평균이익",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgMargin",
          label: "평균이익률",
          width: "100px",
          formatter: (v) => `${v}%`,
        },
      ];
    }

    if (rankingType === "profit") {
      return [
        ...common,
        {
          key: "contributionProfit",
          label: "공헌이익",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgContributionProfit",
          label: "일평균이익",
          width: "120px",
          formatter: formatCurrency,
        },
        {
          key: "compareRate",
          label: rankingCompareLabel,
          width: "110px",
          isDelta: true,
        },
        {
          key: "avgPrice",
          label: "평균판매가",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgProfit",
          label: "평균이익",
          width: "110px",
          formatter: formatCurrency,
        },
        {
          key: "avgMargin",
          label: "평균이익률",
          width: "100px",
          formatter: (v) => `${v}%`,
        },
      ];
    }

    return [
      ...common,
      {
        key: "originalPrice",
        label: "기존판매가",
        width: "110px",
        formatter: formatCurrency,
      },
      {
        key: "changedPrice",
        label: "변경판매가",
        width: "110px",
        formatter: formatCurrency,
      },
      {
        key: "dropAmount",
        label: "하락폭",
        width: "90px",
        formatter: formatCurrency,
      },
    ];
  }, [rankingType, rankingCompareLabel]);

  const handleProductCodeClick = (code) => {
    nav(`/admin/product-update/${code}`, {
      state: { focusSection: "ai-pricing" },
    });
  };

  return (
    <PageWrap>
      <Title>판매 현황</Title>

      <ModeTabs>
        {MODE_OPTIONS.map((item) => (
          <ModeTabButton
            key={item.key}
            type="button"
            $active={mode === item.key}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </ModeTabButton>
        ))}
      </ModeTabs>

      <SummaryGrid>
        {summary.cards.map((card) => {
          const numericChange = Number(card.change || 0);
          const isUp = numericChange >= 0;
          return (
            <SummaryCard
              key={card.title}
              title={card.title}
              value={
                <>
                  {card.value}
                  {card.suffix && <span>{card.suffix}</span>}
                </>
              }
              change={`${Math.abs(numericChange).toFixed(1)}% ${summary.compareLabel}`}
              up={isUp}
            />
          );
        })}
      </SummaryGrid>

      <GlobalFilterRow>
        <SearchDate
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />

        <SelectBar
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
          width="120px"
        />
      </GlobalFilterRow>
      {isLoading ? (
        <LoadingText>데이터를 불러오는 중입니다.</LoadingText>
      ) : null}

      <ChartTwoCol>
        <Panel>
          <PanelTitleRow>
            <PanelTitle>카테고리 별 판매 추이</PanelTitle>
            <MiniLegendRow>
              <LegendDot $color="var(--blue)" /> 매출
              <LegendDot $color="var(--yellow)" /> 공헌이익
            </MiniLegendRow>
          </PanelTitleRow>

          <InnerTabs>
            {categoryOptions.map((key) => (
              <InnerTabButton
                key={key}
                type="button"
                $active={trendCategory === key}
                onClick={() => setTrendCategory(key)}
              >
                {key}
              </InnerTabButton>
            ))}
          </InnerTabs>

          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryTrendData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#9aa3b2" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9aa3b2" }}
                  tickFormatter={formatAxisToMan}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === "sales" ? "매출" : "공헌이익",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  name="sales"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={false}
                  name="profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>

        <Panel>
          <PanelTitleRow>
            <PanelTitle>카테고리 별 판매 비중</PanelTitle>
          </PanelTitleRow>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {categoryShareData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </ChartTwoCol>

      <WidePanel>
        <PanelTitleRow>
          <PanelTitle>시간대별 최저가 변동 추이</PanelTitle>

          <PanelHeaderFilters>
            <SearchDate
              type="single"
              selected={hourlyDate}
              onChange={setHourlyDate}
              shadow={false}
              border={true}
            />

            <SearchBar
              value={hourlyKeyword}
              onChange={setHourlyKeyword}
              placeholder="상품명, 상품코드로 검색"
              shadow={false}
              border={true}
            />
          </PanelHeaderFilters>
        </PanelTitleRow>

        <SubInfoText>
          상품코드 : {hourlySelectedProduct.productCode || "-"} / 상품명 :{" "}
          {hourlySelectedProduct.productName || "-"}
        </SubInfoText>

        <ChartBox $tall>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyChartData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#9aa3b2" }}
                tickFormatter={formatAxisToMan}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#9aa3b2" }}
                tickFormatter={(value) => `${Math.round(value)}원`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
                formatter={(value, name) => {
                  if (name === "판매량") {
                    return [formatCount(value), name];
                  }

                  return [formatCurrency(value), name];
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
              />
              <Bar
                yAxisId="left"
                dataKey="sales"
                name="판매량"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Bar
                yAxisId="left"
                dataKey="profit"
                name="공헌이익"
                fill="#fbbf24"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="lowestPrice"
                name="최저가"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="myPrice"
                name="나의 판매가"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartBox>
      </WidePanel>

      <ChartTwoCol>
        <Panel>
          <PanelTitleRow>
            <PanelTitle>악성 재고 상품</PanelTitle>
            <MiniActionText>&lt; 전략 수정 추천 &gt;</MiniActionText>
          </PanelTitleRow>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>판매가</th>
                  <th>재고량</th>
                </tr>
              </thead>
              <tbody>
                {inventoryRows.map((row, index) => (
                  <tr key={row.product_code}>
                    <td>{index + 1}</td>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() => handleProductCodeClick(row.product_code)}
                      >
                        {row.product_code}
                      </CodeButton>
                    </td>
                    <td>{row.product_name}</td>
                    <td>{formatCurrency(row.sale_price)}</td>
                    <td>{row.stock_days}개</td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </Panel>

        <Panel>
          <PanelTitleRow>
            <PanelTitle>상품별 판매 비중</PanelTitle>
          </PanelTitleRow>

          <InnerTabs>
            {categoryOptions.map((key) => (
              <InnerTabButton
                key={key}
                type="button"
                $active={productMixCategory === key}
                onClick={() => setProductMixCategory(key)}
              >
                {key}
              </InnerTabButton>
            ))}
          </InnerTabs>

          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productMixData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#9aa3b2" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9aa3b2" }}
                  tickFormatter={formatAxisToMan}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value, name) => {
                    if (name === "판매량") {
                      return [formatCount(value), name];
                    }

                    return [formatCurrency(value), name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="discount"
                  stackId="a"
                  name="가격인하"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  stackId="a"
                  name="공헌이익"
                  fill="#f8b4b4"
                />
                <Bar dataKey="sales" stackId="a" name="판매량" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </ChartTwoCol>

      <WidePanel>
        <PanelTitleRow>
          <PanelTitle>랭킹 TOP 5</PanelTitle>

          <PanelHeaderFilters>
            <SelectBar
              value={rankingType}
              onChange={setRankingType}
              options={RANKING_TYPE_OPTIONS}
              width="120px"
              border={true}
              shadow={false}
            />
            <SelectBar
              value={rankingCategory}
              onChange={setRankingCategory}
              options={[
                { label: "전체", value: "전체" },
                ...categoryOptions.map((c) => ({ label: c, value: c })),
              ]}
              width="120px"
              border={true}
              shadow={false}
            />
            <SelectBar
              value={rankingPeriod}
              onChange={setRankingPeriod}
              options={PERIOD_OPTIONS}
              width="120px"
              border={true}
              shadow={false}
            />
          </PanelHeaderFilters>
        </PanelTitleRow>

        <RankingTableScroll>
          <RankingTable>
            <thead>
              <tr>
                {rankingColumns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankingRows.length === 0 ? (
                <tr>
                  <td colSpan={rankingColumns.length}>
                    <EmptyCell>
                      <AlertTriangle size={18} />
                      조건에 맞는 데이터가 없습니다.
                    </EmptyCell>
                  </td>
                </tr>
              ) : (
                rankingRows.map((row) => (
                  <tr key={row.product_code}>
                    {rankingColumns.map((column) => {
                      const snakeKey = column.key.replace(
                        /[A-Z]/g,
                        (match) => `_${match.toLowerCase()}`,
                      );
                      const value = row[snakeKey];

                      if (column.isLink) {
                        return (
                          <td key={column.key}>
                            <CodeButton
                              type="button"
                              onClick={() =>
                                handleProductCodeClick(row.product_code)
                              }
                            >
                              {value}
                            </CodeButton>
                          </td>
                        );
                      }

                      if (column.isDelta) {
                        const isNegative = Number(value) < 0;
                        return (
                          <td key={column.key}>
                            <DeltaBadge $negative={isNegative}>
                              {formatPercent(value)}
                            </DeltaBadge>
                          </td>
                        );
                      }

                      return (
                        <td key={column.key}>
                          {column.formatter ? column.formatter(value) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </RankingTable>
        </RankingTableScroll>
      </WidePanel>
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

const ModeTabs = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--border);
`;

const ModeTabButton = styled.button`
  min-width: 160px;
  width: 100%;
  height: 44px;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "var(--blue)" : "var(--font)")};
  font-size: 16px;
  font-weight: 600;
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    background: ${({ $active }) => ($active ? "var(--blue)" : "transparent")};
    border-radius: 999px;
  }
`;

const GlobalFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const LoadingText = styled.div`
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
`;

const sharedField = css`
  height: 40px;
  border: 1px solid #e7ebf1;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const DateInputWrap = styled.div`
  position: relative;
  width: ${({ $small }) => ($small ? "140px" : "150px")};
`;

const DateInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 36px 0 12px;

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

const DateIconWrap = styled.div`
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

const SelectWrap = styled.div`
  position: relative;
  width: 120px;
`;

const Select = styled.select`
  ${sharedField};
  width: 100%;
  padding: 0 34px 0 12px;
  appearance: none;
`;

const ChevronIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--placeholder);
  pointer-events: none;
`;

const SearchInputWrap = styled.div`
  position: relative;
  width: 220px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 12px 0 36px;
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

const StatCardWrap = styled.div`
  padding: 18px 18px 16px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #edf1f6;
`;

const StatTitle = styled.div`
  color: #374151;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
`;

const StatValue = styled.div`
  color: #111827;
  font-size: 26px;
  font-weight: 900;
`;

const StatSuffix = styled.div`
  color: #4b5563;
  font-size: 18px;
  font-weight: 700;
`;

const StatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;

  span:last-child {
    color: #9aa3b2;
    font-weight: 600;
  }
`;

const ChartTwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  padding: 16px;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow);
`;

const WidePanel = styled.section`
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h3`
  margin: 0px;
  color: var(--font);
  font-size: 15px;
  font-weight: 700;
`;

const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const MiniLegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 600;
`;

const LegendDot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  margin-right: 4px;
`;

const InnerTabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const InnerTabButton = styled.button`
  min-width: 62px;
  height: 32px;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#2563eb" : "#4b5563")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const ChartBox = styled.div`
  width: 100%;
  height: ${({ $tall }) => ($tall ? "320px" : "260px")};
`;

const PanelHeaderSplit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PanelHeaderFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubInfoText = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const MiniActionText = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const MiniTableWrap = styled.div`
  overflow-x: auto;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 10px;
    border-bottom: 1px solid #eef2f7;
    font-size: 13px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: #9aa3b2;
    font-weight: 700;
  }

  td {
    color: #1f2937;
  }
`;

const RankingTableScroll = styled.div`
  overflow-x: auto;
`;

const RankingTable = styled.table`
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #eef2f7;
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
  }

  th {
    color: #9aa3b2;
    font-weight: 700;
  }

  td {
    color: #1f2937;
    font-weight: 500;
  }
`;

const CodeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DeltaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $negative }) => ($negative ? "#ffe7e7" : "#dcf7e8")};
  color: ${({ $negative }) => ($negative ? "#ef5350" : "#18b663")};
`;

const EmptyCell = styled.div`
  min-height: 120px;
  color: #9aa3b2;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
