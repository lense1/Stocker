import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/stocker-logo.svg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    adminId: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    adminId: "",
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
      adminId: "",
      password: "",
    };

    if (!form.adminId.trim()) {
      nextErrors.adminId = "아이디을 입력해주세요.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "비밀번호를 입력해주세요.";
    }

    if (nextErrors.adminId || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      const detail =
        error?.response?.data?.detail || "아이디 또는 비밀번호를 확인해주세요.";
      const lowerDetail = String(detail).toLowerCase();

      if (lowerDetail.includes("adminId")) {
        setFieldErrors({
          adminId: String(detail),
          password: "",
        });
        return;
      }

      if (lowerDetail.includes("password")) {
        setFieldErrors({
          adminId: "",
          password: String(detail),
        });
        return;
      }

      setFieldErrors({
        adminId: "아이디 또는 비밀번호를 확인해주세요.",
        password: "",
      });
    }
  };

  return (
    <Page>
      <Inner>
        <FormSection>
          <FormCard>
            <LogoArea>
              <LogoImage src={logo} alt="Stock+er" />
            </LogoArea>

            <Form onSubmit={handleLogin}>
              <InputGroup>
                <Label>관리자 아이디</Label>
                <Input
                  $error={!!fieldErrors.adminId}
                  type="adminId"
                  name="adminId"
                  value={form.adminId}
                  onChange={handleChange}
                  placeholder="아이디 입력"
                />
                {fieldErrors.adminId && (
                  <ErrorText>{fieldErrors.adminId}</ErrorText>
                )}
              </InputGroup>

              <InputGroup>
                <Label>비밀번호</Label>
                <Input
                  $error={!!fieldErrors.password}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호 입력"
                />
                {fieldErrors.password && (
                  <ErrorText>{fieldErrors.password}</ErrorText>
                )}
              </InputGroup>

              <MainButton type="submit">로그인</MainButton>
            </Form>
          </FormCard>
        </FormSection>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f4f1eb;
  padding: 40px 24px;
`;

const Inner = styled.div`
  max-width: 1280px;
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormSection = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoArea = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 45px;
`;

const LogoImage = styled.img`
  display: block;
  width: 60%;
  max-width: 420px;
  height: auto;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 32px;
  padding: 40px 32px;
  box-shadow: 0 18px 50px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #222;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid ${({ $error }) => ($error ? "#e15b64" : "#e5ddd2")};
  background: #fcfbf8;
  font-size: 15px;
  color: #111;

  &::placeholder {
    color: #a59a8d;
  }

  &:focus {
    border-color: ${({ $error }) => ($error ? "#e15b64" : "#111")};
    background: #fff;
  }
`;

const ErrorText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 13px;
  color: #e15b64;
`;

const MainButton = styled.button`
  width: 100%;
  height: 58px;
  border-radius: 18px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 6px;
`;
