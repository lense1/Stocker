import { plainApi } from "./axios";

export const getHomeMain = async () => {
  const response = await plainApi.get("/home");
  return response.data;
};