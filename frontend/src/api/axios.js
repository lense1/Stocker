import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../auth/tokenStorage";

export const plainApi = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
});

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
});

let isRefreshing = false;
let subscribers = [];

const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
  subscribers.forEach((callback) => callback(newAccessToken));
  subscribers = [];
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/signup") ||
      originalRequest?.url?.includes("/auth/email/send-code") ||
      originalRequest?.url?.includes("/auth/email/verify-code");

    if (status !== 401 || originalRequest?._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await plainApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = response.data.access_token;
      setAccessToken(newAccessToken);
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;