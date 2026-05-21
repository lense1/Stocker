import api, { plainApi } from "./axios";

export const sendEmailCode = async (email) => {
  const response = await plainApi.post("/auth/email/send-code", { email });
  return response.data;
};

export const verifyEmailCode = async ({ email, code }) => {
  const response = await plainApi.post("/auth/email/verify-code", {
    email,
    code,
  });
  return response.data;
};

export const signup = async (payload) => {
  const response = await plainApi.post("/auth/signup", payload);
  return response.data;
};

export const login = async ({ email, password }) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await plainApi.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const getGoogleLoginUrl = () => "http://localhost:8000/api/v1/auth/google/login";

export const getKakaoLoginUrl = () => "http://localhost:8000/api/v1/auth/kakao/login";

export const getNaverLoginUrl = () => "http://localhost:8000/api/v1/auth/naver/login";

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post("/auth/logout", {
    refresh_token: refreshToken,
  });
  return response.data;
};