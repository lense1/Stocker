import api from "./axios";

export const addCartItem = async (productId, quantity) => {
  const response = await api.post("/cart/items", {
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const getMyCart = async () => {
  const response = await api.get("/cart/me");
  return response.data;
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await api.patch(`/cart/items/${cartItemId}/quantity`, {
    quantity,
  });
  return response.data;
};

export const updateCartItemChecked = async (cartItemId, checked) => {
  const response = await api.patch(`/cart/items/${cartItemId}/checked`, {
    checked,
  });
  return response.data;
};

export const updateCartCheckAll = async (checked) => {
  const response = await api.patch("/cart/me/check-all", {
    checked,
  });
  return response.data;
};

export const deleteCartItem = async (cartItemId) => {
  const response = await api.delete(`/cart/items/${cartItemId}`);
  return response.data;
};