import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

/* =========================
   페이지 전체 기본 배경
========================= */
export const Page = styled.div`
  width: 100%;
  background: #efefef;
  padding: 0 0 200px;
`;

/* =========================
   메인 히어로 섹션
========================= */
export const HeroSection = styled.section`
  width: 100%;
  background: #e7dccd;
  overflow: hidden;
  height: 100%;
`;

export const HeroCanvas = styled.div`
  position: relative;
  width: 100%;
  max-width: 1265px;
  margin: 0 auto;
`;

export const HeroBaseImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  left: 4.1%;
  top: 10%;
  width: 29.2%;
  z-index: 2;

  padding: 28px 26px 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(3px);

  @media (max-width: 900px) {
    width: 31%;
    left: 4%;
    top: 15%;
  }

  @media (max-width: 640px) {
    width: 33%;
    left: 4%;
    top: 14%;
  }
`;

export const HeroTitle = styled.h1`
  font-size: clamp(18px, 3vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: #111111;
`;

export const HeroButton = styled.button`
  width: clamp(74px, 9vw, 138px);
  height: clamp(28px, 3vw, 44px);
  margin-top: clamp(14px, 2.2vw, 36px);
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: clamp(8px, 1vw, 13px);
  font-weight: 700;
`;

export const StatsRow = styled.div`
  margin-top: clamp(20px, 4.1vw, 56px);
  display: flex;
  align-items: flex-start;
  gap: clamp(10px, 1.5vw, 22px);

  @media (max-width: 560px) {
    display: none;
  }
`;

export const StatBlock = styled.div`
  min-width: 0;
`;

export const StatValue = styled.div`
  font-size: clamp(16px, 2vw, 42px);
  line-height: 1;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #111111;
  white-space: nowrap;
`;

export const StatLabel = styled.div`
  margin-top: 4px;
  font-size: clamp(7px, 0.72vw, 12px);
  font-weight: 600;
  color: #7d7368;
  white-space: nowrap;
`;

export const StatDivider = styled.div`
  width: 1px;
  height: clamp(24px, 3vw, 52px);
  background: rgba(17, 17, 17, 0.12);
  margin-top: 1px;
`;

/* =========================
   브랜드 로고 바
========================= */
const marqueeMove = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

export const BrandBar = styled.section`
  width: 100%;
  background: #000000;
`;

export const BrandCanvas = styled.div`
  width: 100%;
  max-width: 1265px;
  height: 81px;
  margin: 0 auto;
  overflow: hidden;
  background: #000000;
`;

export const BrandTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${marqueeMove} 20s linear infinite;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
`;

export const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 46px;
  padding: 0 23px;
  height: 81px;
  flex-shrink: 0;
`;

export const BrandLogoItem = styled.div`
  width: 124px;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BrandLogo = styled.img`
  display: block;
  max-width: 100%;
  max-height: 40px;
  object-fit: contain;
  transform: scale(${({ $scale }) => $scale || 1});
  transform-origin: center;
`;

/* =========================
   공통 메인 섹션
========================= */
export const MainSection = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  padding: 50px 24px 0;
`;

export const MainSectionTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;
  margin: 50px 0 50px;

  @media (max-width: 900px) {
    font-size: 30px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;
  margin: 0 0 50px;

  @media (max-width: 900px) {
    font-size: 30px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const HotDealSection = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0px 20px 50px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCardWrap = styled.article``;

export const ProductThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background: #f8f8f8;
  border: 1px solid #ece5db;
  overflow: hidden;
`;

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  object-fit: contain;
  transform: scale(${({ $scale }) => $scale || 1});
  transform-origin: center;
`;

export const ProductName = styled(Link)`
  display: block;
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.45;
  font-weight: 700;
  color: #111111;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
`;

export const StarsWrap = styled.div`
  position: relative;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.5px;
`;

export const StarsBase = styled.span`
  color: #c7c7c7;
`;

export const StarsFill = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $width }) => `${$width}%`};
  overflow: hidden;
  color: #ffbf1a;
  white-space: nowrap;
`;

export const RatingText = styled.span`
  color: #8d857b;
  font-size: 12px;
  font-weight: 600;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  flex-wrap: wrap;
`;

export const CurrentPrice = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: #111111;
`;

export const OriginalPrice = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #999189;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ $positive }) => ($positive ? "#dfeeff" : "#f5dddd")};
  color: ${({ $positive }) => ($positive ? "#2f6fd6" : "#c66a6a")};
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`;

export const ViewAllButton = styled.button`
  display: block;
  min-width: 118px;
  height: 40px;
  margin: 24px auto 0;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #d9cfc1;
  background: transparent;
  color: #111111;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;

  &:hover {
    background: rgba(217, 207, 193, 0.15);
  }
`;

export const ViewAllSpacer = styled.div`
  width: 118px;
  height: 40px;
  margin: 24px auto 0;
`;

export const SectionDivider = styled.div`
  max-width: calc(1180px - 48px);
  height: 1px;
  margin: 30px auto 0;
  background: #ded6cb;
`;

/* =========================
   Sales Item 영역
========================= */
export const SalesSection = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  padding: 30px 20px 56px;
`;

export const SalesPanel = styled.div`
  border-radius: 28px;
  background: #dedede;
  padding: 50px;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

export const SalesTopRow = styled.div`
  display: grid;
  grid-template-columns: 0.74fr 1.26fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const SalesBottomRow = styled.div`
  display: grid;
  grid-template-columns: 1.36fr 0.84fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const SalesImageCardBase = styled(Link)`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 16px;
  background: #e9dece;
  text-decoration: none;
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
    transition: background 0.25s ease;
  }

  &:hover::after {
    background: rgba(0, 0, 0, 0.32);
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

export const SalesImageCard = styled(SalesImageCardBase)`
  height: 500px;
`;

export const SalesWideImageCard = styled(SalesImageCardBase)`
  height: 500px;
`;

export const SalesSmallImageCard = styled(SalesImageCardBase)`
  height: 500px;
`;

export const SalesImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $variant }) => {
    switch ($variant) {
      case "shin":
        return "50% -28%";
      case "hetban":
        return "50% 0%";
      case "curry":
        return "50% 75%";
      case "cokezero":
        return "50% 0%";
      default:
        return "center center";
    }
  }};
  transform: ${({ $variant }) => {
    switch ($variant) {
      case "shin":
        return "scale(1.08)";
      case "hetban":
        return "scale(1.05)";
      case "curry":
        return "scale(1.06)";
      case "cokezero":
        return "scale(1.03)";
      default:
        return "scale(1)";
    }
  }};
  transform-origin: center center;
  transition: transform 0.3s ease;
`;

export const SalesItemName = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  color: #ffffff;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);

  @media (max-width: 640px) {
    font-size: 16px;
    top: 14px;
    left: 14px;
  }
`;

/* =========================
   AI Ranking 섹션
========================= */
export const AIRankingSection = styled.section`
  width: 100%;
  padding: 50px 24px 0;
`;

export const AIRankingTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;
  margin: 0 0 50px;

  @media (max-width: 900px) {
    font-size: 30px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const AIRankingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const AIRankingCard = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 24px 22px;
  min-height: 470px;
  display: flex;
  flex-direction: column;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
`;

export const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.02em;
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #f5f1eb;
  color: #7b756d;
  font-size: 10px;
  font-weight: 700;
`;

export const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 0;
  justify-content: flex-start;
`;

export const BarItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 0 12px;
`;

export const BarItemTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const RankBadge = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #77726b;
  color: #555;
  font-size: 15px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #fff;
`;

export const BarMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const BarHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
`;

export const BarLabel = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
  font-size: 16px;
  color: #5f5a54;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const BarValueWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
`;

export const BarValue = styled.span`
  font-size: 16px;
  color: #eb6c6c;
  text-align: right;
  font-weight: 900;
  line-height: 1;
`;

export const BarSubValue = styled.span`
  font-size: 12px;
  color: #9a958d;
  text-align: right;
  font-weight: 700;
  line-height: 1;
`;

export const BarTrack = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #ece7df;
  overflow: hidden;
`;

export const BarFill = styled.div`
  height: 100%;
  border-radius: 999px;
`;

export const BarDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #d8d2ca;
  margin-top: 14px;
`;

/* 오른쪽 주간 정보 카드 */
export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const SelectBox = styled.select`
  min-width: 108px;
  height: 34px;
  padding: 0 34px 0 12px;
  border: none;
  border-radius: 999px;
  background: #f7f4ef;
  color: #222;
  font-size: 12px;
  font-weight: 800;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;

  &:hover {
    background: #f0ebe3;
  }
`;

export const SelectArrowText = styled.span`
  position: absolute;
  right: 12px;
  font-size: 11px;
  color: #8f8a82;
  pointer-events: none;
`;

export const SelectArrow = styled(ChevronDown)`
  position: absolute;
  right: 12px;
  width: 14px;
  height: 14px;
  color: #8f8a82;
  pointer-events: none;
`;

export const MoreLink = styled.button`
  color: #23b14d;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
`;

export const MiniTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fbf9f6;
  border: 1px solid #eee7dd;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 6px;
  table-layout: fixed;

  th,
  td {
    padding: 10px 8px;
    font-size: 11px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
  }

  thead th {
    background: #f5f1eb;
    color: #7b756d;
    font-weight: 700;
  }

  tbody td {
    color: #333;
    border-top: 1px solid #eee7dd;
  }
`;

export const InnerSelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
`;

export const InnerSelect = styled.select`
  max-width: 120px;
  border: none;
  background: transparent;
  color: #222;
  font-size: 12px;
  font-weight: 700;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  padding-right: 18px;
`;

export const InnerSelectArrow = styled(ChevronDown)`
  position: absolute;
  right: 0;
  width: 14px;
  height: 14px;
  color: #8f8a82;
  pointer-events: none;
`;

export const TruncateCellText = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PositiveValue = styled.span`
  color: #ff5a5a;
  font-weight: 800;
`;

export const NegativeValue = styled.span`
  color: #1d63ff;
  font-weight: 800;
`;

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
`;

export const PeriodTab = styled.button`
  min-width: 38px;
  height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: #444;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 3px rgba(0, 0, 0, 0.08)" : "none"};
`;

export const TrendChartWrap = styled.div`
  margin-top: 14px;
  background: #fbf9f6;
  border: 1px solid #eee7dd;
  border-radius: 14px;
  padding: 14px 12px 12px;
`;

export const CustomChartArea = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 72px;
  gap: 10px;
  align-items: stretch;
`;

export const YAxisColumn = styled.div`
  height: 216px;
  display: grid;
  grid-template-rows: repeat(6, 1fr) 28px;
  align-items: start;
`;

export const YAxisLabel = styled.span`
  font-size: 11px;
  color: #9a958d;
  line-height: 1;
  transform: translateY(-6px);
`;

export const ChartMain = styled.div`
  min-width: 0;
`;

export const PlotArea = styled.div`
  position: relative;
  height: 188px;
`;

export const ChartGridLines = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  pointer-events: none;
`;

export const GridLine = styled.div`
  width: 100%;
  border-top: 1px solid #ece7df;
`;

export const LineSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

export const XAxisRow = styled.div`
  height: 28px;
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: start;
`;

export const XAxisLabel = styled.span`
  text-align: center;
  font-size: 11px;
  color: #9a958d;
  line-height: 1;
`;

export const ChartLegendSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding-top: 8px;
`;

export const SideLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SideLegendLine = styled.span`
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #000;
  flex-shrink: 0;
`;

export const SideLegendText = styled.span`
  font-size: 10px;
  color: #8f8a82;
  line-height: 1;
`;