import api from "./axios";

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};
