import { plainApi } from "./axios";

export const getProductList = async (params = {}) => {
  const response = await plainApi.get("/products", { params });
  return response.data;
};

export const getAILowestProducts = async (params = {}) => {
  const response = await plainApi.get("/products/ai-lowest", { params });
  return response.data;
};

export const getProductDetail = async ({ productId, productCode }) => {
  if (productId) {
    const response = await plainApi.get(`/products/${productId}`);
    return response.data;
  }

  if (productCode) {
    const response = await plainApi.get(
      `/products/by-code/${encodeURIComponent(productCode)}`
    );
    return response.data;
  }

  throw new Error("상품 상세 조회에 필요한 productId 또는 productCode가 없습니다.");
};