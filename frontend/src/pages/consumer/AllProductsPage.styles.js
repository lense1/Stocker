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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

export const ProductThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background: #f7f7f7;
  border: 1px solid #ece5db;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: transparent;
`;

export const ProductBody = styled.div`
  padding: 12px 12px 0;
`;

export const ProductName = styled.h3`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.02em;
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

export const Stars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1px;
  line-height: 1;
`;

export const StarChar = styled.span`
  display: inline-block;
  font-size: 13px;
  line-height: 1;
  color: ${({ $type }) => ($type === "empty" ? "#d9d4cc" : "#ffbf1a")};

  ${({ $type }) =>
    $type === "half" &&
    css`
      background: linear-gradient(90deg, #ffbf1a 50%, #d9d4cc 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    `}
`;

export const RatingText = styled.span`
  color: #7e776f;
  font-size: 12px;
  font-weight: 600;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 7px;
`;

export const CurrentPrice = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: #111111;
  line-height: 1;
`;

export const OriginalPrice = styled.span`
  font-size: 12px;
  color: #a59b90;
  text-decoration: line-through;
  font-weight: 700;
`;

export const DiscountBadge = styled.span`
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: #fbe8e8;
  color: #d65f5f;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
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

export const TagRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ProductTag = styled.span`
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  ${({ $tone }) => badgeTone[$tone] || badgeTone.default}
`;

export const EmptyBox = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 48px 20px;
  text-align: center;
  color: #7a736b;
  font-size: 16px;
  font-weight: 600;
`;

export const PaginationRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
`;

export const PageButton = styled.button`
  min-width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#111111" : "#e3dbcf")};
  background: ${({ $active }) => ($active ? "#111111" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111111")};
  font-size: 12px;
  font-weight: 800;
`;
