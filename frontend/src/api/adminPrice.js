import { getAdminProductDetail, updateAdminProduct } from "./adminProduct";
import api from "./axios";

export const getAdminPriceSearchList = async () => {
  const response = await api.get("/admin/products/price-search/list");
  return response.data;
};

export const getAdminPriceHistory = async ({
  keyword,
  startDate,
  endDate,
}) => {
  const response = await api.get("/admin/price/history", {
    params: {
      keyword,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    },
  });

  return response.data;
};

const buildAdminProductUpdatePayload = (detail, patch = {}) => {
  const nextAiPricingEnabled =
    patch.ai_pricing_enabled ?? Boolean(detail.ai_pricing_enabled);

  return {
    category_id: detail.category_id,
    product_name: detail.product_name ?? "",
    sale_status: patch.sale_status ?? detail.sale_status,

    catalog_external_id: detail.catalog_external_id ?? null,
    catalog_name: detail.catalog_name ?? null,
    current_lowest_price: detail.current_lowest_price ?? null,

    sale_price: Number(detail.sale_price ?? 0),
    cost_price: Number(detail.cost_price ?? 0),

    ai_pricing_enabled: nextAiPricingEnabled,

    min_price_limit: detail.min_price_limit ?? null,
    max_price_limit: detail.max_price_limit ?? null,
    price_per_time: detail.price_per_time ?? null,

    stock_qty: Number(detail.stock_qty ?? 0),
    safety_stock_qty: Number(detail.safety_stock_qty ?? 0),
    expiration_date: detail.expiration_date ?? null,
    description_html: detail.description_html ?? null,
    brand_name: detail.brand_name ?? null,
    origin_country: detail.origin_country ?? null,
    shipping_fee: Number(detail.shipping_fee ?? 0),
    thumbnail_image_url: detail.thumbnail_image_url ?? null,
    detail_image_urls: Array.isArray(detail.detail_image_urls)
      ? detail.detail_image_urls
      : [],
  };
};
export const patchAdminPriceSearchRow = async (productCode, patch = {}) => {
  const detail = await getAdminProductDetail(productCode);

  return updateAdminProduct(
    productCode,
    buildAdminProductUpdatePayload(detail, patch),
  );
};

export const getAdminMatchingSummary = async () => {
  const response = await api.get("/admin/products/matching/summary");
  return response.data;
};