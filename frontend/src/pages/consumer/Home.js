import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import herosectionImg from "../../assets/sinramyeon banner.png";
import * as S from "./HomeStyles";
import { brandLogos } from "./HomeData";
import { getHomeMain } from "../../api/home";

import salesShinramyunImg from "../../assets/sinramyeon img.jpg";
import salesCokezeroImg from "../../assets/cocacola img.png";
import salesCurryImg from "../../assets/curry img.jpg";
import salesHetbanImg from "../../assets/hatban img.jpg";
import { getProductReviewMeta, formatRatingText } from "../../mocks/productReviewMeta";

function StarRating({ rating }) {
  const numericRating = Number.parseFloat(rating) || 0;
  const percentage = Math.max(0, Math.min(100, (numericRating / 5) * 100));

  return (
    <S.StarsWrap aria-label={`평점 ${numericRating}점 / 5점`}>
      <S.StarsBase>★★★★★</S.StarsBase>
      <S.StarsFill $width={percentage}>★★★★★</S.StarsFill>
    </S.StarsWrap>
  );
}

function AIRankingSection({ data, onViewMore }) {
  const [selectedDropCategoryId, setSelectedDropCategoryId] = useState(
    data.priceDropTop5ByCategory?.[0]?.categoryId || "",
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.categories?.[0]?.id || "",
  );

  const [selectedProductId, setSelectedProductId] = useState(
    data.categories?.[0]?.products?.[0]?.id || "",
  );

  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  const truncateText = (text = "", max = 10) => {
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  const selectedDropCategory =
    data.priceDropTop5ByCategory?.find(
      (category) => category.categoryId === selectedDropCategoryId,
    ) || data.priceDropTop5ByCategory?.[0];

  const maxDropAmount = Math.max(
    ...(selectedDropCategory?.items?.map((item) => Number(item.dropAmount) || 0) || []),
    1,
  );

  useEffect(() => {
    if (!data.priceDropTop5ByCategory?.length) return;

    const exists = data.priceDropTop5ByCategory.some(
      (category) => category.categoryId === selectedDropCategoryId,
    );

    if (!exists) {
      setSelectedDropCategoryId(data.priceDropTop5ByCategory[0].categoryId);
    }
  }, [data, selectedDropCategoryId]);

  useEffect(() => {
    if (!data.categories?.length) return;

    const currentCategory = data.categories.find(
      (category) => category.id === selectedCategoryId,
    );

    if (!currentCategory) {
      setSelectedCategoryId(data.categories[0].id);
      setSelectedProductId(data.categories[0].products?.[0]?.id || "");
      return;
    }

    const hasSelectedProduct = currentCategory.products?.some(
      (product) => product.id === selectedProductId,
    );

    if (!hasSelectedProduct) {
      setSelectedProductId(currentCategory.products?.[0]?.id || "");
    }
  }, [data, selectedCategoryId, selectedProductId]);

  const selectedCategory =
    data.categories?.find((category) => category.id === selectedCategoryId) ||
    data.categories?.[0];

  const selectedProduct =
    selectedCategory?.products?.find(
      (product) => product.id === selectedProductId,
    ) || selectedCategory?.products?.[0];

  const graphData =
    selectedPeriod === "weekly"
      ? selectedProduct?.weekly
      : selectedProduct?.monthly;

  const chartSeries = graphData?.series || [];
  const allValues = chartSeries.flatMap((series) => series.values || []);
  const rawMax = Math.max(...allValues, 0);
  const chartMax = rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;

  const yAxisTicks = Array.from({ length: 6 }, (_, index) =>
    Math.round(chartMax - (chartMax / 5) * index),
  );

  return (
    <S.AIRankingSection>
      <S.AIRankingTitle>AI Ranking</S.AIRankingTitle>

      <S.AIRankingGrid>
        <S.AIRankingCard>
          <S.CardTop>
            <S.CardTitle>가격 하락폭 TOP 5</S.CardTitle>

            <S.SelectWrap>
              <S.SelectBox
                value={selectedDropCategoryId}
                onChange={(e) => setSelectedDropCategoryId(e.target.value)}
              >
                {data.priceDropTop5ByCategory?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </S.SelectBox>
              <S.SelectArrowText>▾</S.SelectArrowText>
            </S.SelectWrap>
          </S.CardTop>

          <S.BarList>
            {selectedDropCategory?.items?.map((item, index) => (
              <S.BarItem key={`${item.name}-${index}`}>
                <S.BarItemTop>
                  <S.RankBadge>{index + 1}</S.RankBadge>

                  <S.BarMain>
                    <S.BarHeader>
                      <S.BarLabel title={item.name}>{item.name}</S.BarLabel>

                      <S.BarValueWrap>
                        <S.BarValue>
                          -{(Number(item.dropAmount) || 0).toLocaleString()}원
                        </S.BarValue>
                        <S.BarSubValue>
                          -{Number(item.dropRate || 0)}%
                        </S.BarSubValue>
                      </S.BarValueWrap>
                    </S.BarHeader>

                    <S.BarTrack>
                      <S.BarFill
                        style={{
                          width: `${((Number(item.dropAmount) || 0) / maxDropAmount) * 100}%`,
                          background:
                            index === 0
                              ? "#f06464"
                              : index === 1
                                ? "#f27a7a"
                                : index === 2
                                  ? "#f38e8e"
                                  : index === 3
                                    ? "#f5a4a4"
                                    : "#f6b8b8",
                        }}
                      />
                    </S.BarTrack>
                  </S.BarMain>
                </S.BarItemTop>

                {index !== selectedDropCategory.items.length - 1 && (
                  <S.BarDivider />
                )}
              </S.BarItem>
            ))}
          </S.BarList>
        </S.AIRankingCard>

        <S.AIRankingCard>
          <S.CardTop>
            <S.CardTitle>AI 분석 주간 정보</S.CardTitle>

            <S.TopActions>
              <S.SelectWrap>
                <S.SelectBox
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  {data.categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </S.SelectBox>
                <S.SelectArrow />
              </S.SelectWrap>

              <S.MoreLink type="button" onClick={onViewMore}>
                더보기
              </S.MoreLink>
            </S.TopActions>
          </S.CardTop>

          <S.MiniTable>
            <thead>
              <tr>
                <th style={{ width: "14%" }}>SN</th>
                <th style={{ width: "34%" }}>
                  <S.InnerSelectWrap>
                    <S.InnerSelect
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      {selectedCategory?.products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {truncateText(product.name, 10)}
                        </option>
                      ))}
                    </S.InnerSelect>
                    <S.InnerSelectArrow />
                  </S.InnerSelectWrap>
                </th>
                <th style={{ width: "17%" }}>금주</th>
                <th style={{ width: "17%" }}>7일전 대비</th>
                <th style={{ width: "18%" }}>2주전 대비</th>
              </tr>
            </thead>

            <tbody>
              {selectedProduct && (
                <tr>
                  <td>5</td>
                  <td title={selectedProduct.name}>
                    <S.TruncateCellText>
                      {truncateText(selectedProduct.name, 10)}
                    </S.TruncateCellText>
                  </td>
                  <td>{selectedProduct.currentPrice.toLocaleString()}</td>
                  <td>
                    {selectedProduct.weekCompare > 0 ? (
                      <S.PositiveValue>
                        +{selectedProduct.weekCompare}
                      </S.PositiveValue>
                    ) : (
                      <S.NegativeValue>
                        {selectedProduct.weekCompare}
                      </S.NegativeValue>
                    )}
                  </td>
                  <td>
                    {selectedProduct.twoWeekCompare > 0 ? (
                      <S.PositiveValue>
                        +{selectedProduct.twoWeekCompare}
                      </S.PositiveValue>
                    ) : (
                      <S.NegativeValue>
                        {selectedProduct.twoWeekCompare}
                      </S.NegativeValue>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </S.MiniTable>

          <S.TabRow>
            <S.PeriodTab
              type="button"
              $active={selectedPeriod === "monthly"}
              onClick={() => setSelectedPeriod("monthly")}
            >
              월간
            </S.PeriodTab>
            <S.PeriodTab
              type="button"
              $active={selectedPeriod === "weekly"}
              onClick={() => setSelectedPeriod("weekly")}
            >
              주간
            </S.PeriodTab>
          </S.TabRow>

          <S.TrendChartWrap>
            <S.CustomChartArea>
              <S.YAxisColumn>
                {yAxisTicks.map((value) => (
                  <S.YAxisLabel key={value}>{value}</S.YAxisLabel>
                ))}
              </S.YAxisColumn>

              <S.ChartMain>
                <S.PlotArea>
                  <S.ChartGridLines>
                    {yAxisTicks.map((_, index) => (
                      <S.GridLine key={index} />
                    ))}
                  </S.ChartGridLines>

                  {chartSeries.map((series, index) => (
                    <S.LineSvg
                      key={`${series.name}-${index}`}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke={series.color}
                        strokeWidth="1.8"
                        points={(series.values || [])
                          .map((value, valueIndex) => {
                            const total = (series.values || []).length;
                            const x =
                              total <= 1 ? 0 : (valueIndex / (total - 1)) * 100;
                            const y =
                              100 - ((Number(value) || 0) / chartMax) * 100;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </S.LineSvg>
                  ))}
                </S.PlotArea>

                <S.XAxisRow>
                  {graphData?.labels?.map((label) => (
                    <S.XAxisLabel key={label}>{label}</S.XAxisLabel>
                  ))}
                </S.XAxisRow>
              </S.ChartMain>

              <S.ChartLegendSide>
                {chartSeries.map((series, index) => (
                  <S.SideLegendItem key={`${series.name}-${index}`}>
                    <S.SideLegendLine style={{ background: series.color }} />
                    <S.SideLegendText>{series.name}</S.SideLegendText>
                  </S.SideLegendItem>
                ))}
              </S.ChartLegendSide>
            </S.CustomChartArea>
          </S.TrendChartWrap>
        </S.AIRankingCard>
      </S.AIRankingGrid>

      <S.ViewAllButton type="button" onClick={onViewMore}>
        더보기
      </S.ViewAllButton>
    </S.AIRankingSection>
  );
}

function ProductCard({ item }) {
  const isPositive = item.discount.trim().startsWith("+");
  const navigate = useNavigate();

  return (
    <S.ProductCardWrap>
      <S.ProductThumb
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/products/${item.id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/products/${item.id}`);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <S.ProductImage
          src={item.image}
          alt={item.name}
          $scale={item.imageScale}
        />
      </S.ProductThumb>

      <S.ProductName to={`/products/${item.id}`}>{item.name}</S.ProductName>

      <S.RatingRow>
        <StarRating rating={item.ratingValue} />
        <S.RatingText>{item.rating}</S.RatingText>
      </S.RatingRow>

      <S.PriceRow>
        <S.CurrentPrice>{item.price}</S.CurrentPrice>
        {item.originalPrice ? (
          <S.OriginalPrice>{item.originalPrice}</S.OriginalPrice>
        ) : null}
        <S.DiscountBadge $positive={isPositive}>
          {item.discount}
        </S.DiscountBadge>
      </S.PriceRow>
    </S.ProductCardWrap>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [homeData, setHomeData] = useState({
    bestItems: [],
    hotDealItems: [],
    aiRanking: {
      priceDropTop5ByCategory: [],
      categories: [],
    },
  });

  const salesItems = {
    shin: {
      name: "신라면",
      image: salesShinramyunImg,
      to: "/products/1",
      variant: "shin",
    },
    hetban: {
      name: "햇반",
      image: salesHetbanImg,
      to: "/products/9",
      variant: "hetban",
    },
    curry: {
      name: "3분카레",
      image: salesCurryImg,
      to: "/products/31",
      variant: "curry",
    },
    cokezero: {
      name: "코카콜라제로",
      image: salesCokezeroImg,
      to: "/products/12",
      variant: "cokezero",
    },
  };

  useEffect(() => {
    const formatCardItems = (items = []) =>
      items.map((item) => {
        const reviewMeta = getProductReviewMeta(item);

        return {
          id: item.id,
          name: item.name,
          ratingValue: reviewMeta.rating,
          rating: formatRatingText(reviewMeta.rating),
          reviewCount: reviewMeta.reviewCount,
          price: `${Number(item.price || 0).toLocaleString()}원`,
          originalPrice: item.original_price
            ? `${Number(item.original_price).toLocaleString()}원`
            : "",
          discount:
            item.discount_rate > 0 ? `-${item.discount_rate}%` : "0%",
          image: item.thumbnail_image_url,
          imageScale: 0.82,
        };
      });

    const fetchHomeMain = async () => {
      try {
        const data = await getHomeMain();

        setHomeData({
          bestItems: formatCardItems(data.best_items),
          hotDealItems: formatCardItems(data.hot_deal_items),
          aiRanking: {
            priceDropTop5ByCategory: (
              data.ai_ranking?.price_drop_top5_by_category || []
            ).map((category) => ({
              categoryId: category.category_id,
              categoryName: category.category_name,
              items: (category.items || []).map((item) => ({
                name: item.name,
                dropAmount: item.drop_amount,
                dropRate: item.drop_rate,
              })),
            })),
            categories: (data.ai_ranking?.categories || []).map((category) => ({
              id: category.id,
              name: category.name,
              products: (category.products || []).map((product) => ({
                id: product.id,
                name: product.name,
                currentPrice: product.current_price,
                weekCompare: product.week_compare,
                twoWeekCompare: product.two_week_compare,
                weekly: {
                  labels: product.weekly?.labels || [],
                  series: product.weekly?.series || [],
                },
                monthly: {
                  labels: product.monthly?.labels || [],
                  series: product.monthly?.series || [],
                },
              })),
            })),
          },
        });
      } catch (error) {
        console.error("홈 메인 조회 실패:", error);
      }
    };

    fetchHomeMain();
  }, []);

  return (
    <S.Page>
      <S.HeroSection>
        <S.HeroCanvas>
          <S.HeroBaseImage src={herosectionImg} alt="메인 히어로" />

          <S.HeroOverlay>
            <S.HeroTitle>
              농심 辛라면
              <br />
              Stock+er 에서
              <br />
              최저가로 구매 !
            </S.HeroTitle>

            <S.HeroButton type="button" onClick={() => navigate("/products/1")}>
              Buy Now
            </S.HeroButton>

            <S.StatsRow>
              <S.StatBlock>
                <S.StatValue>900만+</S.StatValue>
                <S.StatLabel>누적 구매</S.StatLabel>
              </S.StatBlock>

              <S.StatDivider />

              <S.StatBlock>
                <S.StatValue>8.9만+</S.StatValue>
                <S.StatLabel>리뷰 수</S.StatLabel>
              </S.StatBlock>

              <S.StatDivider />

              <S.StatBlock>
                <S.StatValue>10억$+</S.StatValue>
                <S.StatLabel>누적 수익액</S.StatLabel>
              </S.StatBlock>
            </S.StatsRow>
          </S.HeroOverlay>
        </S.HeroCanvas>
      </S.HeroSection>

      <S.BrandBar>
        <S.BrandCanvas>
          <S.BrandTrack>
            <S.BrandGroup>
              {brandLogos.map((logo) => (
                <S.BrandLogoItem key={logo.id}>
                  <S.BrandLogo
                    src={logo.src}
                    alt={logo.alt}
                    $scale={logo.scale}
                  />
                </S.BrandLogoItem>
              ))}
            </S.BrandGroup>

            <S.BrandGroup aria-hidden="true">
              {brandLogos.map((logo) => (
                <S.BrandLogoItem key={`clone-${logo.id}`}>
                  <S.BrandLogo
                    src={logo.src}
                    alt={logo.alt}
                    $scale={logo.scale}
                  />
                </S.BrandLogoItem>
              ))}
            </S.BrandGroup>
          </S.BrandTrack>
        </S.BrandCanvas>
      </S.BrandBar>

      <S.MainSection>
        <AIRankingSection
          data={homeData.aiRanking}
          onViewMore={() => navigate("/ai-lowest-price")}
        />

        <S.SectionDivider />

        <S.MainSectionTitle>Best</S.MainSectionTitle>

        <S.CardGrid>
          {homeData.bestItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </S.CardGrid>

        <S.ViewAllSpacer aria-hidden="true" />
      </S.MainSection>

      <S.SectionDivider />

      <S.HotDealSection>
        <S.MainSectionTitle>Hot Deal</S.MainSectionTitle>

        <S.CardGrid>
          {homeData.hotDealItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </S.CardGrid>

        <S.ViewAllSpacer aria-hidden="true" />
      </S.HotDealSection>

      <S.SalesSection>
        <S.SalesPanel>
          <S.SectionTitle>Sales Item</S.SectionTitle>

          <S.SalesTopRow>
            <S.SalesImageCard
              to={salesItems.shin.to}
              $variant={salesItems.shin.variant}
            >
              <S.SalesImage
                src={salesItems.shin.image}
                alt={salesItems.shin.name}
                $variant={salesItems.shin.variant}
              />
              <S.SalesItemName>{salesItems.shin.name}</S.SalesItemName>
            </S.SalesImageCard>

            <S.SalesImageCard
              to={salesItems.hetban.to}
              $variant={salesItems.hetban.variant}
            >
              <S.SalesImage
                src={salesItems.hetban.image}
                alt={salesItems.hetban.name}
                $variant={salesItems.hetban.variant}
              />
              <S.SalesItemName>{salesItems.hetban.name}</S.SalesItemName>
            </S.SalesImageCard>
          </S.SalesTopRow>

          <S.SalesBottomRow>
            <S.SalesWideImageCard
              to={salesItems.curry.to}
              $variant={salesItems.curry.variant}
            >
              <S.SalesImage
                src={salesItems.curry.image}
                alt={salesItems.curry.name}
                $variant={salesItems.curry.variant}
              />
              <S.SalesItemName>{salesItems.curry.name}</S.SalesItemName>
            </S.SalesWideImageCard>

            <S.SalesSmallImageCard
              to={salesItems.cokezero.to}
              $variant={salesItems.cokezero.variant}
            >
              <S.SalesImage
                src={salesItems.cokezero.image}
                alt={salesItems.cokezero.name}
                $variant={salesItems.cokezero.variant}
              />
              <S.SalesItemName>{salesItems.cokezero.name}</S.SalesItemName>
            </S.SalesSmallImageCard>
          </S.SalesBottomRow>
        </S.SalesPanel>
      </S.SalesSection>
    </S.Page>
  );
}