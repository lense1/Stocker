import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Minus,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import * as S from "./ProductDetailPageStyles.js";
import { getProductDetail } from "../../api/product";
import { addCartItem } from "../../api/cart";
import shinramyunImg from "../../assets/shinramyeon.jpg";
import {
  getProductReviewMeta,
  formatRatingText,
} from "../../mocks/productReviewMeta";

const TAB_KEYS = {
  DETAIL: "상품상세",
  REVIEW: "상품평",
  INQUIRY: "상품문의",
  RETURN: "교환/반품 안내",
};

const CATEGORY_REVIEW_BANK = {
  라면: [
    "국물 맛이 진하고 면발이 쫄깃해서 재구매 의사 있어요.",
    "간편하게 한 끼 먹기 좋고 매운맛도 적당해요.",
    "멀티팩이라 보관하기 편하고 집에 두고 먹기 좋아요.",
    "가격 대비 만족도가 높고 맛이 익숙해서 실패가 없어요.",
    "야식용으로 사뒀는데 생각보다 훨씬 자주 손이 가네요.",
    "끓였을 때 향이 좋고 기본에 충실한 맛이라 만족해요.",
  ],
  즉석식품: [
    "전자레인지로 바로 먹을 수 있어서 바쁠 때 정말 편해요.",
    "식감이 괜찮고 한 끼 대용으로 생각보다 든든해요.",
    "포장 상태도 깔끔하고 보관하기 좋아서 만족합니다.",
    "양도 적당하고 맛도 무난해서 쟁여두기 좋아요.",
    "간단하게 먹기 좋은데 생각보다 퀄리티가 괜찮아요.",
    "재구매 의사 있어요. 바쁜 날 한 끼 해결하기 편해요.",
  ],
  스낵과자: [
    "바삭하고 맛이 진해서 계속 손이 가요.",
    "양이 적당하고 간식으로 먹기 딱 좋아요.",
    "단짠 밸런스가 괜찮아서 가족들이 다 좋아했어요.",
    "포장도 깔끔하고 생각보다 눅눅하지 않아서 만족해요.",
    "아이들 간식으로 두기 좋고 재구매할 것 같아요.",
    "출출할 때 하나씩 먹기 좋아요.",
  ],
  소시지: [
    "조리도 간편하고 반찬으로 쓰기 좋아요.",
    "짠맛이 과하지 않고 식감이 탱탱해서 만족해요.",
    "간단하게 구워 먹기 좋고 활용도가 높아요.",
    "냉장 보관해두고 먹기 편해서 자주 사게 되네요.",
    "아침 반찬으로 두기 좋아요.",
    "맛이 무난하고 양도 괜찮아요.",
  ],
  탄산음료: [
    "시원하게 마시면 깔끔하고 청량감이 좋아요.",
    "무난하게 즐기기 좋고 가격도 괜찮아요.",
    "행사할 때 사두면 금방 없어지네요.",
    "탄산감이 살아 있어서 만족스러워요.",
    "음식이랑 같이 마시기 좋아요.",
    "가족들이 다 잘 마셔서 자주 주문합니다.",
  ],
  카레: [
    "간편하게 먹기 좋고 밥이랑 잘 어울려요.",
    "생각보다 내용물이 괜찮고 맛도 부드러워요.",
    "바쁠 때 한 끼 해결하기 좋아서 자주 사요.",
    "맵지 않아서 누구나 먹기 편한 맛이에요.",
    "전자레인지 조리가 가능해서 편했어요.",
    "재구매 의사 있습니다.",
  ],
  default: [
    "가격 대비 만족도가 괜찮아요.",
    "무난하게 먹기 좋고 재구매 의사 있어요.",
    "포장 상태도 괜찮고 전체적으로 만족합니다.",
    "생각보다 품질이 괜찮아서 잘 샀어요.",
    "집에 두고 쓰기 좋은 상품이에요.",
    "배송도 빠르고 상품 상태도 좋았어요.",
  ],
};

const CATEGORY_INQUIRY_BANK = {
  라면: [
    {
      question: "멀티팩 기준으로 총 몇 봉 구성인가요?",
      answer: "상품명에 기재된 수량 기준으로 발송되며, 옵션에 따라 멀티팩 또는 낱개 구성일 수 있습니다.",
    },
    {
      question: "유통기한은 보통 얼마나 남은 상품으로 오나요?",
      answer: "출고 시점 기준으로 판매 가능한 충분한 소비기한이 남은 상품만 발송하고 있습니다.",
    },
    {
      question: "박스 단위로 여러 개 구매하면 묶음배송 되나요?",
      answer: "동일 주문 건은 가능한 한 묶음으로 발송되며, 물류 상황에 따라 분리 출고될 수 있습니다.",
    },
  ],
  즉석식품: [
    {
      question: "전자레인지 조리만 가능한가요?",
      answer: "상품에 따라 전자레인지 또는 중탕 조리가 가능하며, 상세 설명의 조리 방법을 참고해 주세요.",
    },
    {
      question: "실온 보관 상품인가요?",
      answer: "상품 유형에 따라 상이하지만, 일반적으로 표시사항에 기재된 보관 방법에 따라 보관해 주세요.",
    },
    {
      question: "한 박스 단위로 구매 가능한가요?",
      answer: "재고 상황에 따라 가능하며, 여러 개 주문 시 묶음 발송으로 처리됩니다.",
    },
  ],
  스낵과자: [
    {
      question: "과자 파손 없이 오나요?",
      answer: "완충 포장 후 출고하지만 택배 이동 중 일부 파손이 발생할 수 있는 점 양해 부탁드립니다.",
    },
    {
      question: "유통기한 짧은 상품은 아닌가요?",
      answer: "판매 가능한 충분한 소비기한이 남은 상품만 출고하고 있습니다.",
    },
    {
      question: "여러 개 주문하면 박스로 오나요?",
      answer: "수량에 따라 박스 또는 묶음 포장으로 출고될 수 있습니다.",
    },
  ],
  소시지: [
    {
      question: "냉장 상품인가요?",
      answer: "상품 특성상 냉장 보관 기준으로 안내되며, 수령 후 즉시 냉장 보관 부탁드립니다.",
    },
    {
      question: "아이스팩 포함되어 오나요?",
      answer: "냉장/신선 상품은 보냉 포장 상태로 출고됩니다.",
    },
    {
      question: "소비기한은 어느 정도 남은 상품으로 오나요?",
      answer: "출고 기준 판매 가능한 충분한 소비기한이 남은 상품으로 발송됩니다.",
    },
  ],
  탄산음료: [
    {
      question: "캔/페트 중 어떤 형태인가요?",
      answer: "상품명에 표기된 규격 기준으로 발송됩니다.",
    },
    {
      question: "묶음 포장 상태로 오나요?",
      answer: "기본 포장 상태를 유지해 발송하며, 물류 상황에 따라 보조 포장이 추가될 수 있습니다.",
    },
    {
      question: "유통기한 넉넉한 편인가요?",
      answer: "판매 가능한 충분한 소비기한이 남은 상품만 출고됩니다.",
    },
  ],
  카레: [
    {
      question: "매운맛인가요?",
      answer: "상품별 맛 강도는 상이하며, 상품명 및 상세 설명을 참고해 주세요.",
    },
    {
      question: "실온 보관 가능한가요?",
      answer: "상품 표시사항 기준으로 보관해 주시면 되며, 일반적으로 실온 보관이 가능합니다.",
    },
    {
      question: "한 끼 분량으로 보기 괜찮나요?",
      answer: "개인차는 있지만 일반적으로 1인 1식 기준으로 많이 찾는 상품입니다.",
    },
  ],
  default: [
    {
      question: "재입고 예정이 있나요?",
      answer: "재고 상황에 따라 순차적으로 입고되며, 판매 페이지를 통해 확인 부탁드립니다.",
    },
    {
      question: "유통기한은 넉넉한가요?",
      answer: "판매 가능한 충분한 소비기한이 남은 상품만 출고하고 있습니다.",
    },
    {
      question: "묶음배송 가능한가요?",
      answer: "동일 주문 건은 가능한 범위 내에서 묶음배송 처리됩니다.",
    },
  ],
};

const MOCK_AUTHORS = [
  "우민*",
  "이상*",
  "이현*",
  "이용*",
  "김경*",
  "박경*",
  "김하*",
  "이준*",
  "박민*",
  "이서*",
  "최유*",
  "정다*",
  "서현*",
  "윤지*",
  "임수*",
];


const RETURN_INFO_ROWS = [
  {
    label: "반품/교환 배송비",
    value:
      "(구매자 귀책) 3,000원 / 6,000원, 무료배송 상품의 경우 최초 배송비 포함 편도 기준으로 부과될 수 있습니다.",
  },
  {
    label: "반품/교환지 주소",
    value: "충청남도 천안시 동남구 대흥로 215 7층, 8층",
  },
  {
    label: "반품/교환 안내",
    value: "상품 상태 확인 후 처리되며, 상세 기준은 아래 안내를 참고해 주세요.",
  },
];

const RETURN_COMMON_RULES = [
  "소비자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품 확인을 위한 포장 훼손 제외)",
  "소비자의 사용 또는 소비에 의해 상품 등의 가치가 현저히 감소한 경우",
  "시간 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우",
  "복제가 가능한 상품 등의 포장을 훼손한 경우",
  "소비자의 주문에 따라 개별적으로 생산되는 상품이 제작에 들어간 경우",
];

const RETURN_DENIED_RULES = [
  "고객 귀책 사유 (단순 변심, 주소 오기재, 주문 착오, 보관 부주의 및 상품 사용으로 가치 하락한 경우 등)",
  "소비자의 사용 또는 소비에 의해 상품 등의 가치가 현저히 감소한 경우",
  "다른 옵션 상품으로 교환을 요청하는 경우",
  "배송완료 후 반품/교환 신청이 누락된 경우",
  "반품/교환 신청 후 일정 기간 내 연락이 닿지 않은 경우",
  "상품 구성품을 임의로 폐기한 경우",
  "교환이 불가능한 일부 프로모션 상품을 요청하는 경우",
];

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function getChartPoints(data, width = 640, height = 220) {
  const paddingX = 38;
  const paddingTop = 36;
  const paddingBottom = 34;

  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return data.map((item, index) => {
    const x =
      paddingX +
      (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);

    const normalized = (item.value - min) / range;
    const y =
      height - paddingBottom - normalized * (height - paddingTop - paddingBottom);

    return {
      ...item,
      x,
      y,
    };
  });
}

function decodeHtmlEntities(value = "") {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function normalizeDescriptionHtml(rawHtml) {
  if (!rawHtml) return "";
  if (typeof window === "undefined") return rawHtml;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = rawHtml;

  wrapper.querySelectorAll("pre.ql-syntax, pre").forEach((pre) => {
    const rawText = (pre.textContent || "").trim();
    if (!rawText) return;

    const decoded = decodeHtmlEntities(rawText);
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(decoded);
    if (!looksLikeHtml) return;

    const temp = document.createElement("div");
    temp.innerHTML = decoded;

    if (!temp.childNodes.length) return;
    pre.replaceWith(...Array.from(temp.childNodes));
  });

  return wrapper.innerHTML;
}

function buildSmoothPath(points) {
  if (!points.length) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;

    d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return d;
}

function buildExpectedLowestWindow(product) {
  if (!product) return "가격 추이 확인";
  if (product.recent_lowest_price == null) return "가격 추이 확인";

  const gap = Number(product.price || 0) - Number(product.recent_lowest_price || 0);

  if (gap <= 100) return "지금";
  if (gap <= 300) return "이번 주";
  return "가격 추이 확인";
}

function buildAiContent(product) {
  if (!product) {
    return {
      headline: "가격 추이 확인 추천",
      summary: "상품 정보를 불러오는 중입니다.",
    };
  }

  if (product.recent_lowest_price == null) {
    return {
      headline: "가격 추이 확인 추천",
      summary:
        "최근 최저가 정보가 충분하지 않아 가격 추이를 함께 확인하는 것이 좋아요.",
    };
  }

  const gap = Number(product.price || 0) - Number(product.recent_lowest_price || 0);

  if (gap <= 0) {
    return {
      headline: "지금 구매 추천",
      summary:
        "현재 판매가가 최근 최저가 수준이에요. 지금 구매해도 부담이 적은 구간입니다.",
    };
  }

  if (gap <= 200) {
    return {
      headline: "지금 구매 추천",
      summary:
        "현재 판매가가 최근 최저가에 가까운 편이에요. 단기 변동을 고려하면 지금 구매가 유리할 수 있어요.",
    };
  }

  return {
    headline: "가격 추이 확인 추천",
    summary:
      "현재 판매가가 최근 최저가보다 다소 높아요. 급하지 않다면 가격 추이를 조금 더 지켜보는 것도 좋아요.",
  };
}

function buildTimingData(product) {
  if (!product) return [];

  const current = Number(product.price || 0);
  const recentLowest = Number(product.recent_lowest_price || current);
  const nearLowest = current - recentLowest <= 200;

  const after3Days = current + Math.max(100, Math.round(current * 0.02));
  const after7Days = current + Math.max(250, Math.round(current * 0.05));

  return [
    { label: "오늘", value: current, status: nearLowest ? "추천" : "보통" },
    { label: "3일 후", value: after3Days, status: nearLowest ? "보통" : "추천" },
    { label: "7일 후", value: after7Days, status: "상승 가능성" },
  ];
}

function buildFallbackDescription(product) {
  if (!product) {
    return "<p>상품 상세 설명이 준비 중입니다.</p>";
  }

  return `
    <h2>상품 소개</h2>
    <p>
      ${product.name} 상품 상세 설명이 준비 중입니다. 현재는 상품 기본 정보와 가격 정보를 우선 제공하고 있어요.
    </p>

    <h3>상품 정보</h3>
    <ul>
      <li><strong>브랜드</strong> : ${product.brand ?? "-"}</li>
      <li><strong>원산지</strong> : ${product.origin_country ?? "-"}</li>
      <li><strong>소비기한</strong> : ${product.expiration_date ?? "-"}</li>
      <li><strong>원가</strong> : ${formatCurrency(product.cost_price)}</li>
      <li><strong>최근 최저가</strong> : ${
        product.recent_lowest_price != null
          ? formatCurrency(product.recent_lowest_price)
          : "-"
      }</li>
    </ul>
  `;
}

function getCategoryKey(categoryName = "") {
  const normalized = String(categoryName).trim();
  if (CATEGORY_REVIEW_BANK[normalized]) return normalized;
  return "default";
}

function seededNumber(seed, min, max) {
  const base = Math.abs(Number(seed || 1));
  const value = (base * 9301 + 49297) % 233280;
  const ratio = value / 233280;
  return Math.floor(min + ratio * (max - min + 1));
}

function seededPick(list, seed) {
  if (!list.length) return "";
  const index = Math.abs(Number(seed || 0)) % list.length;
  return list[index];
}

function buildMockReviews(product) {
  if (!product) return [];

  const categoryKey = getCategoryKey(product.category_name);
  const source = CATEGORY_REVIEW_BANK[categoryKey] || CATEGORY_REVIEW_BANK.default;
  const reviewMeta = getProductReviewMeta(product);
  const count = reviewMeta.reviewCount;

  return Array.from({ length: count }).map((_, index) => {
    const author = seededPick(MOCK_AUTHORS, product.id + index);
    const body = seededPick(source, product.id * (index + 1));
    const day = seededNumber(product.id + index, 1, 28);

    return {
      id: index + 1,
      author: `${author} (user${100 + index}***@naver.com)`,
      date: `Posted on April ${day}, 2026`,
      body: `${body}`,
    };
  });
}

function buildMockInquiries(product) {
  if (!product) return [];

  const categoryKey = getCategoryKey(product.category_name);
  const source =
    CATEGORY_INQUIRY_BANK[categoryKey] || CATEGORY_INQUIRY_BANK.default;
  const count = Math.min(source.length, seededNumber(product.id + 7, 3, 5));

  return source.slice(0, count).map((item, index) => ({
    id: index + 1,
    author: `${seededPick(MOCK_AUTHORS, product.id + index + 30)} (hari***@naver.com)`,
    questionDate: `2026/04/${String(10 + index).padStart(2, "0")} 09:24:09`,
    answerDate: `2026/04/${String(10 + index).padStart(2, "0")} 10:30:30`,
    question: `${product.name} 관련 문의입니다.\n${item.question}`,
    answer: item.answer,
  }));
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(TAB_KEYS.DETAIL);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

const reviews = useMemo(() => buildMockReviews(product), [product]);
const inquiries = useMemo(() => buildMockInquiries(product), [product]);

const reviewMeta = useMemo(() => getProductReviewMeta(product), [product]);
const ratingText = useMemo(
  () => formatRatingText(reviewMeta.rating),
  [reviewMeta]
);

const reviewTabLabel = `상품평(${reviews.length})`;
const inquiryTabLabel = `상품문의(${inquiries.length})`;

const tabs = useMemo(
  () => [
    { key: TAB_KEYS.DETAIL, label: "상품상세" },
    { key: TAB_KEYS.REVIEW, label: reviewTabLabel },
    { key: TAB_KEYS.INQUIRY, label: inquiryTabLabel },
    { key: TAB_KEYS.RETURN, label: "교환/반품 안내" },
  ],
  [reviewTabLabel, inquiryTabLabel]
);

  const pages = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const numericProductId =
          productId && !Number.isNaN(Number(productId)) ? Number(productId) : null;
        const productCode = searchParams.get("productCode");

        const data = await getProductDetail({
          productId: numericProductId,
          productCode: productCode || undefined,
        });

        setProduct(data);
        setQuantity(1);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.detail || "상품 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId, searchParams]);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => {
    if (!product) return;
    setQuantity((prev) => Math.min(prev + 1, Number(product.stock_qty || prev + 1)));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await addCartItem(product.id, quantity);
      alert("장바구니에 담았습니다.");
    } catch (error) {
      const status = error?.response?.status;
      const detail =
        error?.response?.data?.detail || "장바구니 담기에 실패했습니다.";

      if (status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      alert(detail);
    } finally {
      setAdding(false);
    }
  };

  const aiContent = useMemo(() => buildAiContent(product), [product]);
  const expectedLowestWindow = useMemo(
    () => buildExpectedLowestWindow(product),
    [product]
  );
  const buyTimingData = useMemo(() => buildTimingData(product), [product]);

  const trendData = useMemo(() => {
    if (!product) return [];
    if (product.trend_points?.length) return product.trend_points;
    return [{ label: "현재", value: Number(product.price || 0) }];
  }, [product]);

  const chartWidth = 640;
  const chartHeight = 220;
  const chartPoints = useMemo(
    () => getChartPoints(trendData, chartWidth, chartHeight),
    [trendData]
  );
  const chartPath = useMemo(() => buildSmoothPath(chartPoints), [chartPoints]);

  const totalPrice = Number(product?.price || 0) * quantity;

  const discountRate =
    product?.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100
        )
      : null;

  const thumbnailImage = product?.thumbnail_image_url || shinramyunImg;
  const descriptionHtml = useMemo(
    () =>
      normalizeDescriptionHtml(
        product?.description_html || buildFallbackDescription(product)
      ),
    [product]
  );

  if (loading) {
    return (
      <S.Page>
        <S.Content>
          <StatusBox>상품 정보를 불러오는 중입니다.</StatusBox>
        </S.Content>
      </S.Page>
    );
  }

  if (!product || errorMessage) {
    return (
      <S.Page>
        <S.Content>
          <StatusBox>{errorMessage || "상품 정보를 찾을 수 없습니다."}</StatusBox>
        </S.Content>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Content>
        <S.Breadcrumb>
          <BreadcrumbButton type="button" onClick={() => navigate("/")}>
            Home
          </BreadcrumbButton>
          <S.Divider>›</S.Divider>
          <BreadcrumbButton
            type="button"
            onClick={() =>
              navigate(
                `/products?categoryName=${encodeURIComponent(product.category_name)}`
              )
            }
          >
            {product.category_name}
          </BreadcrumbButton>
          <S.Divider>›</S.Divider>
          <S.CurrentCategory>{product.name}</S.CurrentCategory>
        </S.Breadcrumb>

        <S.HeroSection>
          <S.ImagePanel>
            <HeroThumbFrame>
              <HeroThumbImage src={thumbnailImage} alt={product.name} />
            </HeroThumbFrame>
          </S.ImagePanel>

          <S.InfoPanel>
            <S.Title>{product.name}</S.Title>

            <S.RatingRow>
              <S.Stars>★★★★★</S.Stars>
              <S.RatingText>{ratingText}</S.RatingText>
            </S.RatingRow>

            <S.PriceRow>
              <S.CurrentPrice>{formatCurrency(product.price)}</S.CurrentPrice>
              {product.original_price ? (
                <>
                  <S.OriginalPrice>
                    {formatCurrency(product.original_price)}
                  </S.OriginalPrice>
                  {discountRate !== null && (
                    <S.DiscountBadge>-{discountRate}%</S.DiscountBadge>
                  )}
                </>
              ) : null}
            </S.PriceRow>

            <S.AIBadgeRow>
              {product.ai_pricing_enabled ? (
                <S.AIBadge $tone="primary">AI 추천</S.AIBadge>
              ) : null}
              {product.recent_lowest_price != null &&
              product.price - product.recent_lowest_price <= 200 ? (
                <S.AIBadge $tone="accent">최저가 근접</S.AIBadge>
              ) : null}
            </S.AIBadgeRow>

            <S.AISummaryCard>
              <S.AISummaryTitle>AI 구매 추천</S.AISummaryTitle>
              <S.AISummaryHeadline>{aiContent.headline}</S.AISummaryHeadline>
              <S.AISummaryText>{aiContent.summary}</S.AISummaryText>
            </S.AISummaryCard>

            <S.SpecGrid>
              <S.SpecCard>
                <S.SpecLabel>현재가</S.SpecLabel>
                <S.SpecValue>{formatCurrency(product.price)}</S.SpecValue>
              </S.SpecCard>
              <S.SpecCard>
                <S.SpecLabel>최근 최저가</S.SpecLabel>
                <S.SpecValue>
                  {product.recent_lowest_price != null
                    ? formatCurrency(product.recent_lowest_price)
                    : "-"}
                </S.SpecValue>
              </S.SpecCard>
              <S.SpecCard>
                <S.SpecLabel>예상 최저가 시점</S.SpecLabel>
                <S.SpecValue>{expectedLowestWindow}</S.SpecValue>
              </S.SpecCard>
            </S.SpecGrid>

            <S.Specs>
              <li>브랜드 : {product.brand ?? "-"}</li>
              <li>원산지 : {product.origin_country ?? "-"}</li>
              <li>소비기한 : {product.expiration_date ?? "-"}</li>
            </S.Specs>

            <ActionRow>
              <TotalPriceCard>
                <TotalPriceLabel>총 상품금액</TotalPriceLabel>
                <TotalPriceValue>{formatCurrency(totalPrice)}</TotalPriceValue>
              </TotalPriceCard>

              <ActionRight>
                <S.QuantityBox>
                  <S.QtyButton type="button" onClick={decreaseQuantity}>
                    <Minus size={15} strokeWidth={2.3} />
                  </S.QtyButton>
                  <S.QtyValue>{quantity}</S.QtyValue>
                  <S.QtyButton
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= Number(product.stock_qty || 0)}
                  >
                    <Plus size={15} strokeWidth={2.3} />
                  </S.QtyButton>
                </S.QuantityBox>

                <S.CartButton
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || Number(product.stock_qty || 0) < 1}
                >
                  {Number(product.stock_qty || 0) < 1
                    ? "품절"
                    : adding
                    ? "담는 중..."
                    : "장바구니 담기"}
                </S.CartButton>
              </ActionRight>
            </ActionRow>
          </S.InfoPanel>
        </S.HeroSection>

        <S.AnalysisSection>
          <S.AnalysisGrid>
            <S.AnalysisCard>
              <S.AnalysisCardTitle>최근 가격 추이</S.AnalysisCardTitle>
              <S.AnalysisCardSub>
                최근 가격 이력을 기준으로 현재 가격 흐름을 확인할 수 있어요.
              </S.AnalysisCardSub>

              <TrendChartCard>
                <TrendCanvas>
                  <TrendSvg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="none"
                  >
                    {[0, 1, 2].map((idx) => {
                      const y = 52 + idx * 40;
                      return (
                        <line
                          key={idx}
                          x1="38"
                          y1={y}
                          x2={chartWidth - 38}
                          y2={y}
                          stroke="#edf1f6"
                          strokeWidth="1"
                        />
                      );
                    })}

                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#356dce"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartPoints.map((point, index) => (
                      <g key={point.label}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={index === chartPoints.length - 1 ? 8 : 7}
                          fill="#ffffff"
                          stroke="#356dce"
                          strokeWidth="4"
                        />
                      </g>
                    ))}
                  </TrendSvg>

                  <TrendLabelRail>
                    {chartPoints.map((point) => (
                      <TrendLabelMarker
                        key={point.label}
                        style={{ left: `${(point.x / chartWidth) * 100}%` }}
                      >
                        {point.label}
                      </TrendLabelMarker>
                    ))}
                  </TrendLabelRail>
                </TrendCanvas>
              </TrendChartCard>
            </S.AnalysisCard>

            <S.AnalysisCard>
              <S.AnalysisCardTitle>구매 타이밍 예측</S.AnalysisCardTitle>
              <S.AnalysisCardSub>
                현재가와 최근 최저가를 바탕으로 구매 타이밍을 참고용으로 보여줘요.
              </S.AnalysisCardSub>

              <S.TimingList>
                {buyTimingData.map((item) => (
                  <S.TimingItem key={item.label}>
                    <S.TimingLabelWrap>
                      <S.TimingLabel>{item.label}</S.TimingLabel>
                      <S.TimingStatus $status={item.status}>
                        {item.status}
                      </S.TimingStatus>
                    </S.TimingLabelWrap>
                    <S.TimingPrice>{formatCurrency(item.value)}</S.TimingPrice>
                  </S.TimingItem>
                ))}
              </S.TimingList>
            </S.AnalysisCard>
          </S.AnalysisGrid>
        </S.AnalysisSection>

        <S.TabBar>
          {tabs.map((tab) => (
            <S.TabButton
              key={tab.key}
              type="button"
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </S.TabButton>
          ))}
        </S.TabBar>

        {activeTab === TAB_KEYS.DETAIL && (
          <DetailContentSection>
            <QuillHtmlPreview
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />

          </DetailContentSection>
        )}

        {activeTab === TAB_KEYS.REVIEW && (
          <>
            <S.ReviewGrid>
              {reviews.map((review) => (
                <S.ReviewCard key={review.id}>
                  <S.ReviewTop>
                    <S.ReviewHeaderLeft>
                      <S.ReviewStars>★★★★★</S.ReviewStars>
                      <S.AuthorRow>
                        <S.Author>{review.author}</S.Author>
                        <S.VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </S.VerifiedIcon>
                      </S.AuthorRow>
                    </S.ReviewHeaderLeft>

                    <S.MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </S.MoreButton>
                  </S.ReviewTop>

                  <S.ReviewBody>{review.body}</S.ReviewBody>
                  <S.ReviewDate>{review.date}</S.ReviewDate>
                </S.ReviewCard>
              ))}
            </S.ReviewGrid>
          </>
        )}

        {activeTab === TAB_KEYS.INQUIRY && (
          <>
            <S.InquiryList>
              {inquiries.map((item) => (
                <S.InquiryCard key={item.id}>
                  <S.InquiryRowTop>
                    <S.QuestionMeta>
                      <S.QuestionBadge>질문</S.QuestionBadge>
                      <S.QuestionAuthorWrap>
                        <S.QuestionAuthor>{item.author}</S.QuestionAuthor>
                        <S.VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </S.VerifiedIcon>
                      </S.QuestionAuthorWrap>
                    </S.QuestionMeta>

                    <S.MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </S.MoreButton>
                  </S.InquiryRowTop>

                  <S.InquiryQuestionText>
                    {item.question.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </S.InquiryQuestionText>

                  <S.InquiryDate>{item.questionDate}</S.InquiryDate>

                  <S.AnswerBox>
                    <S.AnswerHeaderRow>
                      <S.AnswerHeaderLeft>
                        <S.AnswerBadge>답변</S.AnswerBadge>
                        <S.AnswerAuthor>Stock+er Manager</S.AnswerAuthor>
                      </S.AnswerHeaderLeft>

                      <S.MoreButton type="button">
                        <MoreHorizontal size={16} />
                      </S.MoreButton>
                    </S.AnswerHeaderRow>

                    <S.AnswerText>{item.answer}</S.AnswerText>
                    <S.InquiryDate>{item.answerDate}</S.InquiryDate>
                  </S.AnswerBox>
                </S.InquiryCard>
              ))}
            </S.InquiryList>

          </>
        )}

        {activeTab === TAB_KEYS.RETURN && (
          <S.ReturnSection>
            <S.ReturnTitle>반품/교환 정보</S.ReturnTitle>

            <S.ReturnTable>
              <tbody>
                {RETURN_INFO_ROWS.map((row) => (
                  <tr key={row.label}>
                    <S.ReturnTh>{row.label}</S.ReturnTh>
                    <S.ReturnTd>{row.value}</S.ReturnTd>
                  </tr>
                ))}
              </tbody>
            </S.ReturnTable>

            <S.ReturnSubTitle>반품/교환 기준</S.ReturnSubTitle>

            <S.ReturnParagraph>
              상품 수령 후 7일 이내에 신청하실 수 있습니다. 단, 제품이 표시·광고
              내용과 다르거나, 계약과 다르게 이행된 경우는 제품 수령일로부터
              3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에
              교환/반품이 가능합니다.
              <br />
              ㆍ추가적으로 다음에 해당하는 반품/교환은 신청이 불가능할 수
              있습니다.
            </S.ReturnParagraph>

            <S.ReturnBulletTitle>공통</S.ReturnBulletTitle>
            <S.ReturnBulletList>
              {RETURN_COMMON_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.ReturnBulletList>

            <S.ReturnBulletTitle>저온/신선 상품</S.ReturnBulletTitle>
            <S.ReturnBulletList>
              {RETURN_DENIED_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.ReturnBulletList>

            <S.ReturnBottomLine />
          </S.ReturnSection>
        )}
      </S.Content>
    </S.Page>
  );
}

const StatusBox = styled.div`
  margin-top: 32px;
  padding: 56px 24px;
  border-radius: 24px;
  border: 1px solid #ebe5dc;
  background: #ffffff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #666666;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #e6e0d7;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    align-items: stretch;
    gap: 12px;
  }
`;

const ActionRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const TotalPriceCard = styled.div`
  width: 285px;
  min-width: 190px;
  padding: 12px 16px;
  border-radius: 18px;
  background: #f8f6f2;
  border: 1px solid #eee7dd;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TotalPriceLabel = styled.p`
  margin: 0;
  font-size: 11px;
  color: #8f887f;
  font-weight: 700;
`;

const TotalPriceValue = styled.p`
  margin: 6px 0 0;
  font-size: 24px;
  color: #111111;
  font-weight: 900;
  letter-spacing: -0.04em;
`;

const TrendChartCard = styled.div`
  margin-top: 16px;
  padding: 10px 4px 0;
`;

const TrendSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
`;

const TrendCanvas = styled.div`
  width: 100%;
`;

const TrendLabelRail = styled.div`
  position: relative;
  width: 100%;
  height: 26px;
  margin-top: 8px;
`;

const TrendLabelMarker = styled.div`
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  color: #8b6b4e;
  white-space: nowrap;
`;

const DetailContentSection = styled.section`
  margin-top: 34px;
  padding: 28px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #ebe5dc;

  @media (max-width: 720px) {
    padding: 20px 16px;
  }
`;

const QuillHtmlPreview = styled.div`
  width: 100%;
  color: #374151;
  font-size: 15px;
  line-height: 1.8;
  overflow: hidden;

  * {
    max-width: 100%;
    box-sizing: border-box;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #111827;
    margin: 0 0 14px;
    font-weight: 800;
    line-height: 1.35;
  }

  h1 {
    font-size: 30px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    margin: 0 0 14px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  ul,
  ol {
    margin: 0 0 18px 18px;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
    overflow-wrap: anywhere;
  }

  blockquote {
    margin: 20px 0;
    padding: 16px 18px;
    border-left: 4px solid #2f6fd6;
    background: #f7faff;
    color: #1f2937;
    border-radius: 10px;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 14px 0;
  }

  video,
  iframe {
    display: block;
    max-width: 100%;
    width: 100%;
    border: none;
    border-radius: 14px;
    margin: 16px 0;
  }

  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    margin: 18px 0;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px 12px;
    text-align: left;
    vertical-align: top;
  }

  pre,
  pre.ql-syntax {
    margin: 16px 0;
    padding: 16px 18px;
    border-radius: 14px;
    background: #111827;
    color: #f9fafb;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-x: auto;
  }

  code {
    padding: 2px 6px;
    border-radius: 6px;
    background: #f3f4f6;
    color: #111827;
    font-size: 0.95em;
  }

  pre code {
    padding: 0;
    background: transparent;
    color: inherit;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-center img {
    margin-left: auto;
    margin-right: auto;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-right img {
    margin-left: auto;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-indent-1 {
    padding-left: 3em;
  }

  .ql-indent-2 {
    padding-left: 6em;
  }

  .ql-indent-3 {
    padding-left: 9em;
  }

  .ql-indent-4 {
    padding-left: 12em;
  }

  .ql-video {
    width: 100%;
    min-height: 360px;
  }

  strong {
    color: #111827;
    font-weight: 800;
  }
`;

const BreadcrumbButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #8b8b8b;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

const HeroThumbFrame = styled.div`
  position: relative;
  width: 100%;
  min-height: clamp(400px, 44vw, 400px);
  border-radius: 24px;
  overflow: hidden;
  background: #f6f6f6;

  @media (max-width: 900px) {
    min-height: 380px;
  }
`;

const HeroThumbImage = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transform: scale(1.06);
  transform-origin: center;
`;