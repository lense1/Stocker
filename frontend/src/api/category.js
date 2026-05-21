import { plainApi } from "./axios";

export const getCategories = async () => {
  const response = await plainApi.get("/categories");
  return response.data;
};