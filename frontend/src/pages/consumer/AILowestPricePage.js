import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as S from "./AILowestPricePage.styles";
import { getAILowestProducts } from "../../api/product";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="100%" height="100%" fill="#f4f6f8"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em"
        fill="#a0a8b0" font-size="28" font-family="Arial, sans-serif">
        No Image
      </text>
    </svg>
  `);

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PAGE_SIZE = 6;

function formatPrice(value) {
  return `${Number(value).toLocaleString()}원`;
}

function getChartPoints(data, width = CHART_WIDTH, height = CHART_HEIGHT) {
  const paddingX = 38;
  const paddingTop = 36;
  const paddingBottom = 34;

  const values = data.map((item) => Number(item.value || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return data.map((item, index) => {
    const x =
      paddingX +
      (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);

    const normalized = (Number(item.value || 0) - min) / range;
    const y =
      height -
      paddingBottom -
      normalized * (height - paddingTop - paddingBottom);

    return {
      ...item,
      x,
      y,
    };
  });
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

function AILowestTrendChart({ trendPoints, trendLabels, currentPrice }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const normalizedTrendData = useMemo(() => {
    if (Array.isArray(trendPoints) && trendPoints.length > 0) {
      return trendPoints.map((value, index) => ({
        label: trendLabels?.[index] ?? `${index + 1}`,
        value: Number(value || 0),
      }));
    }

    return [
      {
        label: "현재",
        value: Number(currentPrice || 0),
      },
    ];
  }, [trendPoints, trendLabels, currentPrice]);

  const chartPoints = useMemo(
    () => getChartPoints(normalizedTrendData, CHART_WIDTH, CHART_HEIGHT),
    [normalizedTrendData],
  );

  const chartPath = useMemo(() => buildSmoothPath(chartPoints), [chartPoints]);

  return (
    <S.TrendChartCard>
      <S.TrendCanvas>
        <S.TrendSvg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {[0, 1, 2].map((idx) => {
            const y = 52 + idx * 40;

            return (
              <line
                key={idx}
                x1="38"
                y1={y}
                x2={CHART_WIDTH - 38}
                y2={y}
                stroke="#ddd4c7"
                strokeWidth="1"
              />
            );
          })}

          <path
            d={chartPath}
            fill="none"
            stroke="#2f6fd6"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartPoints.map((point, index) => (
            <g key={`${point.label}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={index === chartPoints.length - 1 ? 8 : 7}
                fill="#ffffff"
                stroke="#2f6fd6"
                strokeWidth="4"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="18"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </S.TrendSvg>

        {hoveredPoint ? (
          <S.TrendTooltip
            style={{
              left: `${(hoveredPoint.x / CHART_WIDTH) * 100}%`,
              top: `${(hoveredPoint.y / CHART_HEIGHT) * 100}%`,
            }}
          >
            <strong>{hoveredPoint.label}</strong>
            <span>{formatPrice(hoveredPoint.value)}</span>
          </S.TrendTooltip>
        ) : null}
      </S.TrendCanvas>

      <S.TrendBottomWrap>
        <S.TrendDateRow>
          {normalizedTrendData.map((point) => (
            <S.TrendDate key={point.label}>{point.label}</S.TrendDate>
          ))}
        </S.TrendDateRow>
      </S.TrendBottomWrap>
    </S.TrendChartCard>
  );
}

export default function AILowestPricePage() {
  const [categories, setCategories] = useState([{ id: "all", name: "전체" }]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("drop");
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const pagedProducts = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return products.slice(startIndex, startIndex + PAGE_SIZE);
  }, [products, page]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, keyword, sortType]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getAILowestProducts({
          keyword: keyword.trim() || undefined,
          category_id:
            selectedCategory === "all" ? undefined : Number(selectedCategory),
          sort: sortType,
        });

        setCategories([
          { id: "all", name: "전체" },
          ...((data.categories || []).map((category) => ({
            id: String(category.id),
            name: category.name,
          })) || []),
        ]);

        const mappedProducts = (data.items || []).map((item) => ({
          id: item.id,
          categoryId: String(item.category_id),
          name: item.name,
          brand: item.brand || "",
          image: item.thumbnail_image_url || FALLBACK_IMAGE,
          currentPrice: Number(item.current_price || 0),
          lowestPrice: Number(item.lowest_price || 0),
          dropAmount: Number(item.drop_amount || 0),
          dropRate: Number(item.drop_rate || 0),
          aiRecommendation: item.ai_recommendation || "",
          aiDescription: item.ai_description || "",
          badgeType: item.badge_tone || "default",
          trendPoints: (item.trend_points || []).map((point) =>
            Number(point.value || 0),
          ),
          trendLabels: (item.trend_points || []).map((point) => point.label),
        }));

        setProducts(mappedProducts);
        setTotalCount(mappedProducts.length);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, keyword, sortType]);

  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name ||
    "전체";

  const handleChangeCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setKeyword("");
  };

  const handleChangePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <S.Page>
      <S.Inner>
        <S.PageHeader>
          <S.PageTitle>AI 최저가</S.PageTitle>
          <S.PageDescription>
            AI가 분석한 최저가 상품과 최근 가격 변동을 한눈에 확인하세요.
          </S.PageDescription>
        </S.PageHeader>

        <S.FilterPanel>
          <S.SectionLabel>카테고리 선택</S.SectionLabel>

          <S.CategoryRow>
            {categories.map((category) => (
              <S.CategoryButton
                key={category.id}
                type="button"
                $active={selectedCategory === category.id}
                onClick={() => handleChangeCategory(category.id)}
              >
                {category.name}
              </S.CategoryButton>
            ))}
          </S.CategoryRow>

          <S.SearchSortRow>
            <S.SearchBox>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.SearchInput
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={`${selectedCategoryName} 내 상품 검색`}
              />
            </S.SearchBox>

            <S.SortSelect
              value={sortType}
              onChange={(event) => setSortType(event.target.value)}
            >
              <option value="drop">하락폭순</option>
              <option value="lowest">최저가순</option>
              <option value="priceLow">현재가 낮은순</option>
              <option value="recommend">AI 추천순</option>
            </S.SortSelect>
          </S.SearchSortRow>

          <S.ResultRow>
            <S.ResultText>
              <S.ResultStrong>{selectedCategoryName}</S.ResultStrong> 카테고리 ·
              총 <S.ResultStrong>{totalCount}</S.ResultStrong>개 상품
            </S.ResultText>
          </S.ResultRow>
        </S.FilterPanel>

        <S.GridSection>
          {isLoading ? (
            <S.EmptyBox>상품을 불러오는 중이에요.</S.EmptyBox>
          ) : products.length > 0 ? (
            <>
              <S.ProductGrid>
                {pagedProducts.map((product) => (
                  <S.ProductCard key={product.id}>
                    <S.ProductTop>
                      <S.ProductThumb>
                        <S.ProductImage
                          src={product.image}
                          alt={product.name}
                        />
                      </S.ProductThumb>

                      <S.ProductMain>
                        <S.BrandText>{product.brand}</S.BrandText>
                        <S.ProductName title={product.name}>
                          {product.name}
                        </S.ProductName>

                        <S.AITag $tone={product.badgeType}>
                          {product.aiRecommendation}
                        </S.AITag>

                        <S.PriceSummary>
                          <S.InfoCard>
                            <S.InfoLabel>현재가</S.InfoLabel>
                            <S.InfoValue>
                              {formatPrice(product.currentPrice)}
                            </S.InfoValue>
                          </S.InfoCard>

                          <S.InfoCard>
                            <S.InfoLabel>최근 최저가</S.InfoLabel>
                            <S.InfoValue>
                              {formatPrice(product.lowestPrice)}
                            </S.InfoValue>
                          </S.InfoCard>

                          <S.InfoCard>
                            <S.InfoLabel>하락폭</S.InfoLabel>
                            <S.DropValue>
                              -{formatPrice(product.dropAmount)}
                            </S.DropValue>
                          </S.InfoCard>
                        </S.PriceSummary>
                      </S.ProductMain>
                    </S.ProductTop>

                    <S.ProductBottom>
                      <S.AIBox>
                        <S.AIBoxTitle>AI 추천 코멘트</S.AIBoxTitle>
                        <S.AIBoxDescription>
                          {product.aiDescription}
                        </S.AIBoxDescription>
                      </S.AIBox>

                      <S.TrendSection>
                        <S.TrendHeaderRow>
                          <S.TrendLabel>최근 가격 추이</S.TrendLabel>
                        </S.TrendHeaderRow>

                        <AILowestTrendChart
                          trendPoints={product.trendPoints}
                          trendLabels={product.trendLabels}
                          currentPrice={product.currentPrice}
                        />
                      </S.TrendSection>

                      <S.ButtonRow>
                        <S.DetailButton to={`/products/${product.id}`}>
                          상세 보기
                        </S.DetailButton>
                      </S.ButtonRow>
                    </S.ProductBottom>
                  </S.ProductCard>
                ))}
              </S.ProductGrid>

              {totalPages > 1 ? (
                <S.PaginationArea>
                  <S.PageButton
                    type="button"
                    disabled={page === 1}
                    onClick={() => handleChangePage(page - 1)}
                  >
                    이전
                  </S.PageButton>

                  {pageNumbers.map((pageNumber) => (
                    <S.PageButton
                      key={pageNumber}
                      type="button"
                      $active={pageNumber === page}
                      onClick={() => handleChangePage(pageNumber)}
                    >
                      {pageNumber}
                    </S.PageButton>
                  ))}

                  <S.PageButton
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => handleChangePage(page + 1)}
                  >
                    다음
                  </S.PageButton>
                </S.PaginationArea>
              ) : null}
            </>
          ) : (
            <S.EmptyBox>조건에 맞는 상품이 없어요.</S.EmptyBox>
          )}
        </S.GridSection>
      </S.Inner>
    </S.Page>
  );
}
