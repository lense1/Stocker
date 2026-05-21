import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.div`
  width: 100%;
  background: #efefef;
`;

export const Inner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 50px 24px 200px;
`;

export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 30px;
  line-height: 1.1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;
`;

export const PageDescription = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #7a736b;
  line-height: 1.6;
`;

export const FilterPanel = styled.section`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 24px;
`;

export const SectionLabel = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: #111111;
  margin-bottom: 16px;
`;

export const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

export const CategoryButton = styled.button`
  min-width: 110px;
  height: 50px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid ${({ $active }) => ($active ? "#111111" : "#e3dbcf")};
  background: ${({ $active }) => ($active ? "#f7f1e9" : "#ffffff")};
  color: #111111;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  transition: all 0.2s ease;

  &:hover {
    background: #f7f1e9;
  }
`;

export const SearchSortRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchBox = styled.div`
  height: 50px;
  border-radius: 16px;
  background: #f7f4ef;
  border: 1px solid #ebe5dc;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

export const SearchIcon = styled.div`
  margin-right: 10px;
  color: #9a938a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #111111;
  font-size: 12px;

  &::placeholder {
    color: #9f988f;
    font-size: 12px;
  }
`;

export const SortSelect = styled.select`
  height: 50px;
  border-radius: 16px;
  border: 1px solid #ebe5dc;
  background: #f7f4ef;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 700;
  color: #111111;
  outline: none;
`;

export const ResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ResultText = styled.p`
  font-size: 12px;
  color: #6f685f;
`;

export const ResultStrong = styled.span`
  color: #111111;
  font-weight: 800;
`;

export const GridSection = styled.section`
  margin-top: 32px;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.article`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 20px;
`;

export const ProductMain = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 2px 0 0;
`;

export const ProductTop = styled.div`
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ProductBottom = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProductThumb = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 18px;
  background: #f7f7f7;
  border: 1px solid #ece5db;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: start;

  @media (max-width: 640px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }
`;

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: transparent;
`;

export const BrandText = styled.p`
  font-size: 12px;
  color: #8b847c;
  font-weight: 700;
  margin: 0;
`;

export const ProductName = styled.h3`
  margin-top: 7px;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.02em;

  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const badgeTone = {
  primary: css`
    background: #eef4ff;
    color: #2f6fd6;
  `,
  accent: css`
    background: #fbe8e8;
    color: #d65f5f;
  `,
  default: css`
    background: #f5f1eb;
    color: #6f685f;
  `,
};

export const AITag = styled.span`
  margin-top: 15px;
  width: fit-content;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  ${({ $tone }) => badgeTone[$tone] || badgeTone.default}
`;

export const PriceSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 15px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  border-radius: 16px;
  background: #f8f6f2;
  border: 1px solid #eee7dd;
  padding: 12px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const InfoLabel = styled.p`
  font-size: 12px;
  color: #8f887f;
  font-weight: 700;
`;

export const InfoValue = styled.p`
  margin-top: 6px;
  font-size: 16px;
  line-height: 1.3;
  color: #111111;
  font-weight: 900;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const DropValue = styled(InfoValue)`
  color: #d65f5f;
`;

export const AIBox = styled.div`
  width: 100%;
  border-radius: 18px;
  background: #fbf9f6;
  border: 1px solid #eee7dd;
  padding: 14px 12px;
`;

export const AIBoxTitle = styled.p`
  font-size: 13px;
  font-weight: 900;
  color: #111111;
`;

export const AIBoxDescription = styled.p`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #6f685f;
`;

export const TrendSection = styled.div`
  width: 100%;
  padding: 14px 12px;
  border-radius: 18px;
  background: #fbf9f6;
  border: 1px solid #eee7dd;
`;

export const TrendHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TrendLabel = styled.p`
  font-size: 13px;
  color: #111111;
  font-weight: 900;
`;

export const TrendChartWrap = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: start;
`;

export const TrendYAxis = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  align-items: center;
  height: 96px;
`;

export const TrendYAxisValue = styled.span`
  font-size: 11px;
  color: #7f776f;
  font-weight: 700;
  line-height: 1;
`;

export const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SimpleTrendChart = styled.div`
  position: relative;
  width: 100%;
  height: 96px;
`;

export const ChartGuideLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: ${({ $top }) => $top};
  height: 1px;
  background: #ddd4c7;
  z-index: 0;
`;

export const SimpleTrendSvg = styled.svg`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;

  circle {
    shape-rendering: geometricPrecision;
  }
`;

export const TrendBottomWrap = styled.div`
  margin-top: 10px;
`;

export const TrendDateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TrendDate = styled.span`
  font-size: 12px;
  color: #7f776f;
  font-weight: 700;
  white-space: nowrap;
`;

export const PeriodTabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PeriodChip = styled.button`
  min-width: 56px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#2f6fd6" : "#ddd5c9")};
  background: ${({ $active }) => ($active ? "#eef4ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#2f6fd6" : "#6f685f")};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 700)};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

export const DetailButton = styled(Link)`
  width: 360px;
  max-width: 100%;
  height: 48px;
  border-radius: 14px;
  background: #111111;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.94;
  }
`;

export const EmptyBox = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 48px 20px;
  text-align: center;
  color: #7a736b;
  font-size: 15px;
  font-weight: 600;
`;

export const TrendChartCard = styled.div`
  margin-top: 16px;
  padding: 10px 4px 0;
`;

export const TrendCanvas = styled.div`
  position: relative;
  width: 100%;
`;

export const TrendSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
`;

export const TrendTooltip = styled.div`
  position: absolute;
  transform: translate(-50%, calc(-100% - 14px));
  min-width: 88px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #111111;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.14);
  z-index: 5;

  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 10px;
    color: #d6d6d6;
    font-weight: 700;
  }

  span {
    display: block;
    font-size: 12px;
    color: #ffffff;
    font-weight: 800;
  }
`;

export const PaginationArea = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PageButton = styled.button`
  min-width: ${({ $active }) => ($active ? "40px" : "38px")};
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#111111" : "#e3dbcf")};
  background: ${({ $active }) => ($active ? "#111111" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111111")};
  font-size: 12px;
  font-weight: 800;

  &:disabled {
    cursor: not-allowed;
    color: #b8b0a6;
    background: #f5f1eb;
  }
`;
