import api from "./axios";

export const getAdminLiveInventoryList = async () => {
  const response = await api.get("/admin/products/live-inventory/list");
  return response.data;
};

export const patchAdminLiveInventoryRow = async (productCode, payload) => {
  const response = await api.patch(
    `/admin/products/live-inventory/${productCode}`,
    payload,
  );
  return response.data;
};

export const createAdminInbound = async (payload) => {
  const response = await api.post("/admin/products/inbound", payload);
  return response.data;
};

export const getAdminInventoryHistoryList = async (params = {}) => {
  const response = await api.get("/admin/products/inventory-history/list", {
    params,
  });
  return response.data;
};

export const getAdminLiveInventorySummary = async () => {
  const response = await api.get("/admin/products/live-inventory/summary");
  return response.data;
};

export const getAdminInventoryHistorySummary = async () => {
  const response = await api.get("/admin/products/inventory-history/summary");
  return response.data;
};