import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import InfoTooltip from "../../../components/InfoTooltip";
import SearchDate from "../../../components/SearchDate";
import SelectBar from "../../../components/SelectBar";
import SummaryCard from "../../../components/SummaryCard";
import SearchBar from "../../../components/SearchBar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAdminAIPriceStat } from "../../../api/adminAIPriceStat";

const PERIOD_OPTIONS = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

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
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatDeltaPercent(value) {
  const numeric = Number(value || 0);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}%`;
}

function getChangeMeta(value) {
  const numeric = Number(value || 0);
  return {
    isPositive: numeric >= 0,
    text: formatDeltaPercent(numeric),
  };
}

function getDiffMeta(aiValue, manualValue, type = "currency") {
  const diff = Number(aiValue || 0) - Number(manualValue || 0);
  const abs = Math.abs(diff);
  const isPositive = diff >= 0;

  if (type === "count") {
    return {
      isPositive,
      text: `${formatNumber(abs)}개`,
    };
  }

  if (type === "percent") {
    return {
      isPositive,
      text: `${abs.toFixed(1)}%`,
    };
  }

  return {
    isPositive,
    text: `${formatNumber(Math.round(abs))}원`,
  };
}

function PerformanceDiffCell({ aiValue, manualValue, type = "currency" }) {
  const { isPositive, text } = getDiffMeta(aiValue, manualValue, type);

  return (
    <PerformanceDiff $positive={isPositive}>
      {isPositive ? "↑" : "↓"} {text}
    </PerformanceDiff>
  );
}

export default function AIPriceStat() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("weekly");

  const [simulationKeyword, setSimulationKeyword] = useState("");
  const [simulationCategory, setSimulationCategory] = useState("전체");
  const [simulationPeriod, setSimulationPeriod] = useState("weekly");

  const [comparePeriod, setComparePeriod] = useState("weekly");
  const [performanceCategory, setPerformanceCategory] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        const data = await getAdminAIPriceStat({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          period,
          simulation_keyword: simulationKeyword || undefined,
          simulation_category: simulationCategory,
          simulation_period: simulationPeriod,
          compare_period: comparePeriod,
          performance_category: performanceCategory || undefined,
        });

        setDashboard(data);

        const options = data?.category_options || [];
        if (
          options.length > 0 &&
          (!performanceCategory || !options.includes(performanceCategory))
        ) {
          setPerformanceCategory(options[0]);
        }
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.detail ||
            "AI 가격변경 분석 조회에 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [
    startDate,
    endDate,
    period,
    simulationKeyword,
    simulationCategory,
    simulationPeriod,
    comparePeriod,
    performanceCategory,
  ]);

  const categoryOptions = dashboard?.category_options || [];

  const summary = dashboard?.summary || {
    compare_label: "전주 대비",
    ai_revenue: 0,
    ai_revenue_change_rate: 0,
    ai_profit: 0,
    ai_profit_margin: 0,
    ai_profit_change_rate: 0,
    lowest_price_share: 0,
    lowest_price_share_change_rate: 0,
    price_change_count: 0,
    price_change_count_change_rate: 0,
  };

  const simulationChartData = dashboard?.simulation?.items || [];
  const categoryComparisonRows = dashboard?.category_comparison?.items || [];
  const categoryCompareLabel =
    dashboard?.category_comparison?.compare_label || "전주 대비";
  const performanceChartData = dashboard?.performance?.items || [];
  const historyRows = dashboard?.history?.items || [];
  const strategyRows = dashboard?.strategy?.items || [];
  const strategyCompareLabel =
    dashboard?.strategy?.compare_label || "전주 대비";

  const handleProductClick = (productCode) => {
    navigate(`/admin/product-update/${productCode}`, {
      state: { focusSection: "ai-pricing" },
    });
  };

  const summaryCards = useMemo(
    () => [
      {
        title: "AI 창출 매출액",
        mainValue: formatNumber(summary.ai_revenue),
        mainSuffix: "원",
        change: summary.ai_revenue_change_rate,
      },
      {
        title: "AI 창출 공헌이익",
        mainValue: formatPercent(summary.ai_profit_margin),
        subValue: `/ ${formatCurrency(summary.ai_profit)}`,
        change: summary.ai_profit_change_rate,
      },
      {
        title: "최저가 점유율",
        mainValue: formatPercent(summary.lowest_price_share),
        change: summary.lowest_price_share_change_rate,
      },
      {
        title: "AI 가격변경 횟수",
        mainValue: formatNumber(summary.price_change_count),
        mainSuffix: "회",
        change: summary.price_change_count_change_rate,
      },
    ],
    [summary],
  );

  return (
    <PageWrap>
      <Title>AI 가격변경 분석</Title>

      <SummaryGrid>
        {summaryCards.map((card) => {
          const numericChange = Number(card.change || 0);
          const isUp = numericChange >= 0;
          return (
            <SummaryCard
              key={card.title}
              title={card.title}
              value={
                <>
                  {card.mainValue}
                  {card.mainSuffix && <span>{card.mainSuffix}</span>}
                  {card.subValue && (
                    <span
                      style={{
                        marginLeft: "6px",
                        fontSize: "15px",
                        color: "var(--font)",
                      }}
                    >
                      {card.subValue}
                    </span>
                  )}
                </>
              }
              change={`${Math.abs(numericChange).toFixed(1)}% ${summary.compare_label}`}
              up={isUp}
            />
          );
        })}
      </SummaryGrid>

      <TopFilterRow>
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
      </TopFilterRow>

      {isLoading ? (
        <LoadingText>데이터를 불러오는 중입니다.</LoadingText>
      ) : null}

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>AI 가격변경 / 수동 가격변경 시뮬레이션</PanelTitle>

          <PanelControls>
            <SearchBar
              value={simulationKeyword}
              onChange={setSimulationKeyword}
              placeholder="상품명, 상품코드로 검색"
              width="220px"
              border={true}
              shadow={false}
            />

            <SelectBar
              value={simulationCategory}
              onChange={setSimulationCategory}
              options={[
                { label: "카테고리 전체", value: "전체" },
                ...categoryOptions.map((c) => ({ label: c, value: c })),
              ]}
              width="130px"
              border={true}
              shadow={false}
            />

            <SelectBar
              value={simulationPeriod}
              onChange={setSimulationPeriod}
              options={PERIOD_OPTIONS}
              width="120px"
              border={true}
              shadow={false}
            />
          </PanelControls>
        </PanelHeaderRow>

        <ChartWrap $tall>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationChartData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--placeholder)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--placeholder)" }}
                tickFormatter={(value) => `${Math.round(value / 10000)}만`}
              />
              <Tooltip
                formatter={(value, name) => [formatCurrency(value), name]}
                contentStyle={{
                  borderRadius: 12,
                  fontSize: 12,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="ai_revenue"
                name="AI 매출"
                stroke="var(--blue)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ai_profit"
                name="AI 이익"
                stroke="#7aa2ff"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manual_revenue"
                name="수동 매출(예측)"
                stroke="var(--red)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manual_profit"
                name="수동 이익(예측)"
                stroke="#f3a5a5"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>
      </LargePanel>

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>카테고리별 AI 성과 비교</PanelTitle>

          <SelectBar
            value={comparePeriod}
            onChange={setComparePeriod}
            options={PERIOD_OPTIONS}
            width="120px"
            border={true}
            shadow={false}
          />
        </PanelHeaderRow>

        <WideTableScroll>
          <CompareTable>
            <thead>
              <tr>
                <th rowSpan="2">카테고리</th>
                <th colSpan="4">성과</th>
                <th colSpan="4">AI 가격변경</th>
                <th colSpan="4">수동 가격변경</th>
              </tr>
              <tr>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
              </tr>
            </thead>
            <tbody>
              {categoryComparisonRows.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>

                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.revenue}
                      manualValue={row.manual.revenue}
                      type="currency"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.profit}
                      manualValue={row.manual.profit}
                      type="currency"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.sales}
                      manualValue={row.manual.sales}
                      type="count"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.margin}
                      manualValue={row.manual.margin}
                      type="percent"
                    />
                  </td>

                  <td>{formatCurrency(row.ai.revenue)}</td>
                  <td>{formatCurrency(row.ai.profit)}</td>
                  <td>{formatCount(row.ai.sales)}</td>
                  <td>{formatPercent(row.ai.margin)}</td>

                  <td>{formatCurrency(row.manual.revenue)}</td>
                  <td>{formatCurrency(row.manual.profit)}</td>
                  <td>{formatCount(row.manual.sales)}</td>
                  <td>{formatPercent(row.manual.margin)}</td>
                </tr>
              ))}
            </tbody>
          </CompareTable>
        </WideTableScroll>
      </LargePanel>

      <TwoColumnGrid>
        <MediumPanel>
          <PanelHeaderRow>
            <PanelTitle>AI 가격변경 성과</PanelTitle>
          </PanelHeaderRow>

          <CategoryTabRow>
            {categoryOptions.map((category) => (
              <CategoryTabButton
                key={category}
                type="button"
                $active={performanceCategory === category}
                onClick={() => setPerformanceCategory(category)}
              >
                {category}
              </CategoryTabButton>
            ))}
          </CategoryTabRow>

          <ChartWrap>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--placeholder)" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--placeholder)" }}
                  tickFormatter={(value) => `${Math.round(value / 10000)}만`}
                />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ai_revenue"
                  name="AI 매출"
                  stroke="var(--blue)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ai_profit"
                  name="AI 이익"
                  stroke="#7aa2ff"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manual_revenue"
                  name="수동 매출(예측)"
                  stroke="var(--red)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manual_profit"
                  name="수동 이익(예측)"
                  stroke="#f3a5a5"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrap>
          <LegendGuide>
            <LegendGuideItem>
              <LegendDot $color="(var--blue)" />
              AI 매출
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="#7aa2ff" />
              AI 이익
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="var(--red)" />
              수동 매출(예측)
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="#f3a5a5" />
              수동 이익(예측)
            </LegendGuideItem>
          </LegendGuide>
        </MediumPanel>

        <MediumPanel>
          <PanelHeaderRow>
            <PanelTitle>AI 가격변경 이력</PanelTitle>
            <TinyHint>&lt; 전략 수정 추천 &gt;</TinyHint>
          </PanelHeaderRow>

          <HistoryTableScroll>
            <HistoryTable>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>사유</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => (
                  <tr key={`${row.product_code}-${row.rank}`}>
                    <td>{row.rank}</td>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() => handleProductClick(row.product_code)}
                      >
                        {row.product_code}
                      </CodeButton>
                    </td>
                    <td>{row.product_name}</td>
                    <td>
                      <ReasonText
                        $type={row.direction === "up" ? "up" : "down"}
                      >
                        {row.direction === "up" ? "▲" : "▼"} {row.reason}
                      </ReasonText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          </HistoryTableScroll>
        </MediumPanel>
      </TwoColumnGrid>

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>전략 수정 필요한 상품</PanelTitle>
          <InfoIconWrap>
            <InfoTooltip
              title="사유 기준 안내"
              ariaLabel="전략 수정 필요한 상품 사유 안내"
              width={300}
              lines={[
                "최저가 제한: 현재 판매가가 최소 허용 가격에 도달했거나 근접해 추가 인하 여지가 거의 없는 상태입니다.",
                "회당 조정가 제한: 현재 판매가가 시장 최저가보다 높아 추가 조정이 필요하지만, 한 번에 조정 가능한 가격 범위를 고려해야 하는 상태입니다.",
              ]}
            />
          </InfoIconWrap>
        </PanelHeaderRow>

        <WideTableScroll>
          <StrategyTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>사유</th>
                <th>판매량</th>
                <th>재고</th>
                <th>{strategyCompareLabel}</th>
                <th>판매가</th>
                <th>이익</th>
                <th>이익률</th>
                <th>카테고리</th>
              </tr>
            </thead>
            <tbody>
              {strategyRows.map((row) => (
                <tr key={`${row.product_code}-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() => handleProductClick(row.product_code)}
                    >
                      {row.product_code}
                    </CodeButton>
                  </td>
                  <td>{row.product_name}</td>
                  <td>
                    <StrategyReason>{row.reason}</StrategyReason>
                  </td>
                  <td>{formatCount(row.sales_qty)}</td>
                  <td>{formatCount(row.stock)}</td>
                  <td>
                    <DeltaBadge $negative={row.compare_rate < 0}>
                      {formatDeltaPercent(row.compare_rate)}
                    </DeltaBadge>
                  </td>
                  <td>{formatCurrency(row.sale_price)}</td>
                  <td>{formatCurrency(row.profit)}</td>
                  <td>{formatPercent(row.margin)}</td>
                  <td>{row.category}</td>
                </tr>
              ))}
            </tbody>
          </StrategyTable>
        </WideTableScroll>
      </LargePanel>
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

const TopFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const LoadingText = styled.div`
  margin-bottom: 12px;
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 700;
`;

const sharedField = css`
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: var(--focus-border);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const LargePanel = styled.section`
  padding: 16px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  background: white;
`;

const MediumPanel = styled.section`
  padding: 16px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  background: white;
`;

const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const PanelTitle = styled.h3`
  margin: 0px;
  color: var(--font);
  font-size: 15px;
  font-weight: 700;
`;

const PanelControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SearchInputWrap = styled.div`
  position: relative;
  width: 220px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 11px;
  transform: translateY(-50%);
  color: var(--placeholder);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 12px 0 36px;
`;

const ChartWrap = styled.div`
  width: 100%;
  height: ${({ $tall }) => ($tall ? "320px" : "250px")};
`;

const WideTableScroll = styled.div`
  overflow-x: auto;
`;

const CompareTable = styled.table`
  width: 100%;
  min-width: 1180px;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #ffffff;
  overflow: hidden;

  th,
  td {
    padding: 14px 12px;
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  thead th {
    color: var(--placeholder);
    font-weight: 700;
    background: #ffffff;
  }

  tbody td {
    color: var(--font);
    font-weight: 500;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  thead tr:last-child th {
    border-bottom: 1px solid #dfe5ee;
  }
`;

const MetricWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const MetricPrimary = styled.span`
  color: var(--font);
  font-weight: 700;
`;

const MetricChange = styled.span`
  color: ${({ $positive }) => ($positive ? "var(--green);" : "var(--red)")};
  font-size: 12px;
  font-weight: 700;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LegendGuide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 600;
`;

const LegendGuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  display: inline-block;
`;

const CategoryTabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const CategoryTabButton = styled.button`
  min-width: 60px;
  height: 32px;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "var(--blue)" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "var(--blue)" : "#4b5563")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const TinyHint = styled.div`
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 700;
`;

const HistoryTableScroll = styled.div`
  overflow-x: auto;
  width: 100%;
`;
const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 10px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: var(--placeholder);
    font-weight: 700;
  }

  td {
    color: var(--font);
  }
`;

const CodeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ReasonText = styled.span`
  color: ${({ $type }) => ($type === "up" ? "var(--green)" : "var(--red)")};
  font-size: 12px;
  font-weight: 700;
`;

const StrategyTable = styled.table`
  width: 100%;
  min-width: 1180px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid var(--border);
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
  }

  th {
    color: var(--placeholder);
    font-weight: 700;
  }

  td {
    color: var(--font);
  }
`;

const StrategyReason = styled.span`
  color: var(--green);
  font-size: 12px;
  font-weight: 700;
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
  color: ${({ $negative }) => ($negative ? "var(--red)" : "var(--green)")};
`;

const InfoIconWrap = styled.div`
  color: var(--placeholder);
  display: flex;
  align-items: center;
`;

const PerformanceDiff = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ $positive }) => ($positive ? "var(--green)" : "var(--red)")};
  font-size: 14px;
  font-weight: 700;
`;
