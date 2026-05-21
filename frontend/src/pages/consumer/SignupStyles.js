import styled from "styled-components";

export const GuideText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 12px;
  color: #8f8477;
  line-height: 1.5;
`;

export const Page = styled.div`
  min-height: 100vh;
  background: #f4f1eb;
  padding: 48px 24px 200px;
`;

export const Inner = styled.div`
  max-width: 1280px;
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormSection = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 32px;
  padding: 36px 28px;
  box-shadow: 0 18px 50px rgba(25, 25, 25, 0.08);
  border: 1px solid #eee7dd;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #222;
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid ${({ $error }) => ($error ? "#e15b64" : "#e5ddd2")};
  background: #fcfbf8;
  font-size: 16px;
  color: #111;

  &::placeholder {
    color: #a59a8d;
  }

  &:focus {
    border-color: ${({ $error }) => ($error ? "#e15b64" : "#111")};
    background: #fff;
  }

  &:disabled {
    background: #f1ede6;
    color: #8f8477;
    cursor: not-allowed;
  }
`;

export const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 118px;
  gap: 10px;
`;

export const ErrorText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 12px;
  color: #e15b64;
  line-height: 1.5;
`;

export const SuccessText = styled.p`
  margin-top: -2px;
  padding-left: 4px;
  font-size: 12px;
  color: #0f766e;
  line-height: 1.5;
`;

export const SmallButton = styled.button`
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 12px;
  font-weight: 800;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const MainButton = styled.button`
  width: 100%;
  height: 58px;
  border-radius: 18px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  margin-top: 6px;
`;

export const BottomRow = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const BottomText = styled.span`
  font-size: 12px;
  color: #6d655b;
`;

export const BottomLink = styled.button`
  font-size: 12px;
  font-weight: 800;
  color: #111;
`;

export const LogoArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 36px;
`;

export const LogoImage = styled.img`
  display: block;
  width: 60%;
  max-width: 420px;
  height: auto;
`;
