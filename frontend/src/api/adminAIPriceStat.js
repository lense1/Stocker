import api from "./axios";

export const getAdminAIPriceStat = async (params = {}) => {
  const response = await api.get("/admin/price/ai-stat", {
    params,
  });
  return response.data;
};