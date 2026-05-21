import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import * as S from "./AllProductsPage.styles";
import { getProductList } from "../../api/product";
import { getProductReviewMeta } from "../../mocks/productReviewMeta";


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

function formatPrice(value) {
  return `${Number(value).toLocaleString()}원`;
}

function getDiscountRate(price, originalPrice) {
  if (!originalPrice || Number(originalPrice) <= Number(price)) return null;
  return Math.round(
    ((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100,
  );
}

function renderStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const fullStars = Math.floor(safeRating);
  const decimal = safeRating - fullStars;
  const hasHalfStar = decimal >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }, (_, index) => (
        <S.StarChar key={`full-${index}`} $type="full">
          ★
        </S.StarChar>
      ))}

      {hasHalfStar ? (
        <S.StarChar key="half" $type="half">
          ★
        </S.StarChar>
      ) : null}

      {Array.from({ length: emptyStars }, (_, index) => (
        <S.StarChar key={`empty-${index}`} $type="empty">
          ★
        </S.StarChar>
      ))}
    </>
  );
}

export default function AllProductsPage() {
  const [productCategories, setProductCategories] = useState([
    { id: "all", name: "전체" },
  ]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();


  const pageSize = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getProductList({
          keyword: keyword.trim() || undefined,
          category_id:
            selectedCategory === "all" ? undefined : Number(selectedCategory),
          sort: sortType,
          page: currentPage,
          size: pageSize,
        });

        const categories = [
          { id: "all", name: "전체" },
          ...((data.categories || []).map((category) => ({
            id: String(category.id),
            name: category.name,
          })) || []),
        ];

        const mappedItems = (data.items || []).map((item) => {
          const mockReview = getProductReviewMeta(item);

          return {
            id: item.id,
            productCode: item.product_code,
            categoryId: String(item.category_id),
            name: item.name,
            brand: item.brand || "",
            price: Number(item.price || 0),
            originalPrice:
              item.original_price != null ? Number(item.original_price) : null,
            rating: mockReview.rating,
            reviewCount: mockReview.reviewCount,
            image: item.thumbnail_image_url || FALLBACK_IMAGE,
            aiTag: item.badge_label || null,
            badgeType: item.badge_tone || "default",
          };
        });

        setProductCategories(categories);
        setProducts(mappedItems);
        setTotalCount(Number(data.total || 0));
        setTotalPages(Math.max(1, Number(data.total_pages || 1)));
      } catch (error) {
        console.error(error);
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, keyword, sortType, currentPage]);

  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    setKeyword(keywordParam);
    setCurrentPage(1);
  }, [searchParams]);

  const selectedCategoryName =
    productCategories.find((category) => category.id === selectedCategory)
      ?.name || "전체";

  useEffect(() => {
    const categoryNameParam = searchParams.get("categoryName");
    if (!categoryNameParam || productCategories.length === 0) return;

    const matched = productCategories.find(
      (category) => category.name === categoryNameParam
    );

    if (matched && matched.id !== selectedCategory) {
      setSelectedCategory(matched.id);
      setCurrentPage(1);
    }
  }, [searchParams, productCategories, selectedCategory]);

  const handleChangeCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setKeyword("");
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("keyword");

    if (categoryId === "all") {
      nextParams.delete("categoryName");
    } else {
      const matchedCategory = productCategories.find(
        (category) => category.id === categoryId
      );
      if (matchedCategory) {
        nextParams.set("categoryName", matchedCategory.name);
      }
    }

    setSearchParams(nextParams);
  };

  const handleChangeKeyword = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeSort = (event) => {
    setSortType(event.target.value);
    setCurrentPage(1);
  };

  return (
    <S.Page>
      <S.Inner>
        <S.PageHeader>
          <S.PageTitle>전체 상품</S.PageTitle>
          <S.PageDescription>
            카테고리별 상품을 확인하고 원하는 상품을 검색해보세요.
          </S.PageDescription>
        </S.PageHeader>

        <S.FilterPanel>
          <S.SectionLabel>카테고리 선택</S.SectionLabel>

          <S.CategoryRow>
            {productCategories.map((category) => (
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
                onChange={handleChangeKeyword}
                placeholder={`${selectedCategoryName} 내 상품 검색`}
              />
            </S.SearchBox>

            <S.SortSelect value={sortType} onChange={handleChangeSort}>
              <option value="latest">최신순</option>
              <option value="priceLow">가격 낮은순</option>
              <option value="priceHigh">가격 높은순</option>
              <option value="ai">AI 추천순</option>
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
            <S.ProductGrid>
              {products.map((product) => {
                const discountRate = getDiscountRate(
                  product.price,
                  product.originalPrice,
                );

                return (
                  <S.ProductCard key={product.id} to={`/products/${product.id}`}>
                    <S.ProductThumb>
                      <S.ProductImage src={product.image} alt={product.name} />
                    </S.ProductThumb>

                    <S.ProductBody>
                      <S.ProductName>{product.name}</S.ProductName>

                      <S.RatingRow>
                        <S.Stars>{renderStars(product.rating)}</S.Stars>
                        <S.RatingText>{product.rating}/5</S.RatingText>
                      </S.RatingRow>

                      <S.PriceRow>
                        <S.CurrentPrice>
                          {formatPrice(product.price)}
                        </S.CurrentPrice>

                        {product.originalPrice ? (
                          <S.OriginalPrice>
                            {formatPrice(product.originalPrice)}
                          </S.OriginalPrice>
                        ) : null}

                        {discountRate ? (
                          <S.DiscountBadge>-{discountRate}%</S.DiscountBadge>
                        ) : null}
                      </S.PriceRow>

                      {product.aiTag ? (
                        <S.TagRow>
                          <S.ProductTag $tone={product.badgeType}>
                            {product.aiTag}
                          </S.ProductTag>
                        </S.TagRow>
                      ) : null}
                    </S.ProductBody>
                  </S.ProductCard>
                );
              })}
            </S.ProductGrid>
          ) : (
            <S.EmptyBox>조건에 맞는 상품이 없어요.</S.EmptyBox>
          )}
        </S.GridSection>

        {totalCount > pageSize ? (
          <S.PaginationRow>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <S.PageButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </S.PageButton>
              ),
            )}
          </S.PaginationRow>
        ) : null}
      </S.Inner>
    </S.Page>
  );
}