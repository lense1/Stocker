import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getGoogleLoginUrl,
  getKakaoLoginUrl,
  getNaverLoginUrl,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/stocker-logo.svg";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import * as S from "./LoginStyles.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const nextErrors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      nextErrors.email = "이메일을 입력해주세요.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "비밀번호를 입력해주세요.";
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      const detail =
        error?.response?.data?.detail || "이메일 또는 비밀번호를 확인해주세요.";
      const lowerDetail = String(detail).toLowerCase();

      if (lowerDetail.includes("email")) {
        setFieldErrors({
          email: String(detail),
          password: "",
        });
        return;
      }

      if (lowerDetail.includes("password")) {
        setFieldErrors({
          email: "",
          password: String(detail),
        });
        return;
      }

      setFieldErrors({
        email: "이메일 또는 비밀번호를 확인해주세요.",
        password: "",
      });
    }
  };

  return (
    <S.Page>
      <S.Inner>
        <S.FormSection>
          <S.FormCard>
            <S.LogoArea>
              <S.LogoImage src={logo} alt="Stock+er" />
            </S.LogoArea>

            <S.Form onSubmit={handleLogin}>
              <S.InputGroup>
                <S.Label>이메일</S.Label>
                <S.Input
                  $error={!!fieldErrors.email}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {fieldErrors.email && (
                  <S.ErrorText>{fieldErrors.email}</S.ErrorText>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>비밀번호</S.Label>
                <S.Input
                  $error={!!fieldErrors.password}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호 입력"
                />
                {fieldErrors.password && (
                  <S.ErrorText>{fieldErrors.password}</S.ErrorText>
                )}
              </S.InputGroup>

              <S.MainButton type="submit">로그인</S.MainButton>
            </S.Form>

            <S.SubActions>
              <S.TextButton type="button">아이디 찾기</S.TextButton>
              <S.Divider />
              <S.TextButton type="button">비밀번호 찾기</S.TextButton>
              <S.Divider />
              <S.TextButton type="button" onClick={() => navigate("/signup")}>
                회원가입
              </S.TextButton>
            </S.SubActions>

            <S.SocialRow>
              <S.SocialIconButton
                type="button"
                onClick={() => {
                  window.location.href = getGoogleLoginUrl();
                }}
              >
                <FcGoogle size={30} />
              </S.SocialIconButton>

              <S.SocialIconButton
                type="button"
                $kakao
                onClick={() => {
                  window.location.href = getKakaoLoginUrl();
                }}
              >
                <RiKakaoTalkFill size={30} />
              </S.SocialIconButton>

              <S.SocialIconButton
                type="button"
                $naver
                onClick={() => {
                  window.location.href = getNaverLoginUrl();
                }}
              >
                <SiNaver size={20} />
              </S.SocialIconButton>
            </S.SocialRow>
          </S.FormCard>
        </S.FormSection>
      </S.Inner>
    </S.Page>
  );
}
