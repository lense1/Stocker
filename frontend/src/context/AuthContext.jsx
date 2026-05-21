import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../api/auth";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../auth/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!member;

  const loadMe = useCallback(async () => {
    const me = await authApi.getMe();
    setMember(me);
    return me;
  }, []);

  const initialize = useCallback(async () => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        setMember(null);
        return;
      }

      await loadMe();
    } catch (error) {
      clearTokens();
      setMember(null);
    } finally {
      setIsInitializing(false);
    }
  }, [loadMe]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authApi.login({ email, password });

      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      const me = await loadMe();
      return me;
    },
    [loadMe],
  );

  const signup = useCallback(async (payload) => {
    return authApi.signup(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error(error);
    } finally {
      clearTokens();
      setMember(null);
    }
  }, []);

  const completeSocialLogin = useCallback(
    async ({ accessToken, refreshToken }) => {
      setTokens({
        accessToken,
        refreshToken,
      });

      const me = await loadMe();
      return me;
    },
    [loadMe],
  );

  useEffect(() => {
    initialize();

    const handleAuthExpired = () => {
      clearTokens();
      setMember(null);
    };

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [initialize]);

  const value = useMemo(
    () => ({
      member,
      isAuthenticated,
      isInitializing,
      login,
      signup,
      logout,
      reloadMe: loadMe,
      completeSocialLogin,
    }),
    [
      member,
      isAuthenticated,
      isInitializing,
      login,
      signup,
      logout,
      loadMe,
      completeSocialLogin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
}
