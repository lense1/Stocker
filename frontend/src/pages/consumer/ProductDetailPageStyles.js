import styled, { css } from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #efefef;
  color: #111111;
  padding: 50px 30px 200px;
`;

export const Content = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 20px 110px;

  @media (max-width: 1024px) {
    padding: 22px 20px 80px;
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 22px;
  font-size: 12px;
  font-weight: 500;
  color: #9b9b9b;
`;

export const Divider = styled.span`
  color: #b5b5b5;
`;

export const CurrentCategory = styled.span`
  color: #767676;
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 460px minmax(0, 1fr);
  gap: 34px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ImagePanel = styled.div`
  width: 100%;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #ebe5dc;
  padding: 24px;
`;

export const ImagePanelInner = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #f7f7f7;

  @media (max-width: 1200px) {
    height: 340px;
  }
`;

export const ProductImage = styled.img`
  width: 240px;
  height: auto;
  object-fit: contain;
  display: block;
`;

export const InfoPanel = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  line-height: 1.18;
  letter-spacing: -0.04em;
  font-weight: 900;
  color: #111111;

  @media (max-width: 1200px) {
    font-size: 30px;
  }
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

export const Stars = styled.div`
  color: #ffc533;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 1px;
`;

export const RatingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #666666;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const CurrentPrice = styled.span`
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #111111;
`;

export const OriginalPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #c7bfb4;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ffe8e8;
  color: #ff6d6d;
  font-size: 10px;
  font-weight: 800;
`;

export const AIBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
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

export const AIBadge = styled.span`
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  ${({ $tone }) => badgeTone[$tone] || badgeTone.default}
`;

export const AISummaryCard = styled.div`
  margin-top: 16px;
  border-radius: 18px;
  background: #fbf9f6;
  border: 1px solid #eee7dd;
  padding: 16px 14px;
`;

export const AISummaryTitle = styled.p`
  font-size: 12px;
  font-weight: 800;
  color: #8b847c;
`;

export const AISummaryHeadline = styled.p`
  margin-top: 6px;
  font-size: 20px;
  font-weight: 900;
  color: #111111;
`;

export const AISummaryText = styled.p`
  margin-top: 8px;
  color: #6f685f;
  font-size: 13px;
  line-height: 1.6;
`;

export const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SpecCard = styled.div`
  border-radius: 16px;
  background: #f8f6f2;
  border: 1px solid #eee7dd;
  padding: 14px 12px;
`;

export const SpecLabel = styled.p`
  font-size: 11px;
  color: #8f887f;
  font-weight: 700;
`;

export const SpecValue = styled.p`
  margin-top: 6px;
  font-size: 18px;
  color: #111111;
  font-weight: 900;
`;

export const Specs = styled.ul`
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  color: #777777;
  font-size: 12px;
  line-height: 1.6;

  li {
    margin-bottom: 2px;
  }
`;

export const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #e6e0d7;
  flex-wrap: wrap;
`;

export const QuantityBox = styled.div`
  width: 100px;
  height: 44px;
  padding: 0 13px;
  border-radius: 999px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const QtyButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #444444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #ffffff;
  }
`;

export const QtyValue = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #222222;
`;

export const SecondaryButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #d9cfc1;
  background: #ffffff;
  color: #111111;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: #f8f6f2;
  }
`;

export const CartButton = styled.button`
  min-width: 180px;
  height: 44px;
  padding: 0 28px;
  border: none;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;

export const AnalysisSection = styled.section`
  margin-top: 24px;
`;

export const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const AnalysisCard = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 20px;
`;

export const AnalysisCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: #111111;
`;

export const AnalysisCardSub = styled.p`
  margin-top: 8px;
  color: #6f685f;
  font-size: 13px;
  line-height: 1.55;
`;

export const SimpleTrendChart = styled.div`
  width: 100%;
  height: 120px;
  margin-top: 14px;
`;

export const SimpleTrendSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

export const TrendLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

export const TrendLabel = styled.span`
  font-size: 11px;
  color: #7f776f;
  font-weight: 600;
`;

export const TimingList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TimingItem = styled.div`
  border-radius: 16px;
  background: #f8f6f2;
  border: 1px solid #eee7dd;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TimingLabelWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimingLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #111111;
`;

export const TimingStatus = styled.span`
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;

  ${({ $status }) =>
    $status === "추천"
      ? css`
          background: #eef4ff;
          color: #2f6fd6;
        `
      : $status === "상승 가능성"
        ? css`
            background: #fbe8e8;
            color: #d65f5f;
          `
        : css`
            background: #f5f1eb;
            color: #6f685f;
          `}
`;

export const TimingPrice = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: #111111;
`;

export const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 34px;
  border-bottom: 1px solid #e5ded3;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TabButton = styled.button`
  position: relative;
  height: 50px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#111111" : "#555555")};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1px;
    width: ${({ $active }) => ($active ? "120px" : "0")};
    height: 2px;
    background: #000000;
    transform: translateX(-50%);
    transition: width 0.18s ease;
  }
`;

export const DetailSection = styled.section`
  margin-top: 34px;
`;

export const DetailImageHero = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #ebe5dc;
`;

export const DetailHeroImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

export const BrandStorySection = styled.section`
  margin-top: 44px;
`;

export const BrandStoryEyebrow = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: #77726b;
`;

export const BrandStoryTitle = styled.h2`
  margin-top: 10px;
  font-size: 48px;
  line-height: 1.05;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.05em;

  @media (max-width: 720px) {
    font-size: 36px;
  }
`;

export const BrandStoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BrandStoryImageWrap = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #ebe5dc;
`;

export const BrandStoryImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

export const BrandStoryTextWrap = styled.div`
  padding-top: 10px;
`;

export const BrandStoryHeadline = styled.h3`
  font-size: 34px;
  line-height: 1.1;
  font-weight: 900;
  color: #e24a4a;
  letter-spacing: -0.03em;
`;

export const BrandStoryText = styled.p`
  margin-top: 18px;
  color: #555555;
  font-size: 18px;
  line-height: 1.8;

  strong {
    color: #111111;
    font-weight: 900;
  }

  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

export const CheckPointSection = styled.section`
  margin-top: 52px;
`;

export const CheckPointEyebrow = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: #77726b;
`;

export const CheckPointTitle = styled.h2`
  margin-top: 10px;
  font-size: 44px;
  line-height: 1.08;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.05em;
`;

export const CheckPointCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckPointCard = styled.div`
  background: #ffffff;
  border: 1px solid #ebe5dc;
  border-radius: 24px;
  padding: 22px 20px;
`;

export const CheckPointCardTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: #111111;
`;

export const CheckPointCardText = styled.p`
  margin-top: 10px;
  color: #666666;
  font-size: 14px;
  line-height: 1.7;
`;

export const ReviewGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 34px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 14px 18px 16px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
`;

export const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ReviewHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ReviewStars = styled.div`
  color: #ffc533;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;
`;

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Author = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #111111;
`;

export const VerifiedIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
`;

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  color: #666666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 10px;
`;

export const ThumbWrap = styled.div`
  position: relative;
  height: 50px;
  overflow: hidden;
  border-radius: 7px;
  background: #f3f3f3;
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ThumbOverlay = styled.div`
  position: absolute;
  top: 50%;
  right: 3px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ReviewBody = styled.p`
  margin: 10px 0 0;
  min-height: 96px;
  color: #666666;
  font-size: 12px;
  line-height: 1.52;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReviewDate = styled.p`
  margin: 18px 0 0;
  color: #777777;
  font-size: 12px;
  font-weight: 500;
`;

export const InquiryList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 34px;
`;

export const InquiryCard = styled.article`
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 18px;
  padding: 18px 18px 16px;
`;

export const InquiryRowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const QuestionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 20px;
  padding: 0 9px;
  border-radius: 999px;
  background: #f2f2f2;
  color: #555555;
  font-size: 12px;
  font-weight: 700;
`;

export const QuestionAuthorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const QuestionAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

export const InquiryQuestionText = styled.div`
  margin-top: 12px;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.65;

  p {
    margin: 0;
  }
`;

export const InquiryDate = styled.p`
  margin: 12px 0 0;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 500;
`;

export const AnswerBox = styled.div`
  margin-top: 14px;
`;

export const AnswerHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AnswerHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AnswerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 20px;
  padding: 0 9px;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
`;

export const AnswerAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

export const AnswerText = styled.p`
  margin: 10px 0 0;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.7;
`;

export const ReturnSection = styled.section`
  margin-top: 34px;
`;

export const ReturnTitle = styled.h3`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

export const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  margin-bottom: 28px;

  tr {
    border: 1px solid #dddddd;
  }
`;

export const ReturnTh = styled.th`
  width: 180px;
  padding: 14px 16px;
  background: #f3f3f3;
  color: #555555;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  border-right: 1px solid #dddddd;
`;

export const ReturnTd = styled.td`
  padding: 14px 16px;
  color: #555555;
  font-size: 13px;
  line-height: 1.6;
`;

export const ReturnSubTitle = styled.h4`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

export const ReturnParagraph = styled.p`
  margin: 0 0 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;
`;

export const ReturnBulletTitle = styled.h5`
  margin: 20px 0 10px;
  color: #444444;
  font-size: 14px;
  font-weight: 800;
`;

export const ReturnBulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;

  li {
    margin-bottom: 2px;
  }
`;

export const ReturnBottomLine = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid #e5e5e5;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 54px;
`;

export const PageNavButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  background: #ffffff;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const PageNumberButton = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid ${({ $active }) => ($active ? "#000000" : "#dfdfdf")};
  background: ${({ $active }) => ($active ? "#000000" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
`;
