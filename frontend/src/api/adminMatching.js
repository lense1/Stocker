import api from "./axios";

export const getAdminMatchingList = async () => {
  const response = await api.get("/admin/products/price-search/list");
  return response.data;
};

export const patchAdminMatchingAiPricing = async (
  productId,
  aiPricingEnabled,
) => {
  const response = await api.patch(`/admin/products/${productId}/ai-pricing`, {
    ai_pricing_enabled: aiPricingEnabled,
  });
  return response.data;
};

export const getAdminMatchingSummary = async () => {
  const response = await api.get("/admin/products/matching/summary");
  return response.data;
};