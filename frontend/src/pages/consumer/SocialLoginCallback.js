import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as S from "./SocialLoginCallbackStyles.js";

export default function SocialLoginCallback() {
  const navigate = useNavigate();
  const { completeSocialLogin } = useAuth();
  const [message, setMessage] = useState("소셜 로그인 처리 중입니다.");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setMessage("로그인 토큰이 없습니다.");
          return;
        }

        await completeSocialLogin({
          accessToken,
          refreshToken,
        });

        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
        setMessage("소셜 로그인 처리에 실패했습니다.");
      }
    };

    run();
  }, [completeSocialLogin, navigate]);

  return (
    <S.Page>
      <S.Card>
        <S.Title>{message}</S.Title>
        <S.Desc>잠시만 기다리면 홈 화면으로 이동해.</S.Desc>
      </S.Card>
    </S.Page>
  );
}
