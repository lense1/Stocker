import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 24px 200px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
`;

export const IconWrap = styled.div`
  width: 82px;
  height: 82px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #fff1f1;
  color: #d14a4a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  color: #111;
  margin-bottom: 12px;
  letter-spacing: -0.04em;
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #666;
`;

export const InfoBox = styled.div`
  margin-top: 24px;
  border: 1px solid #f0e4e4;
  background: #fffafa;
  border-radius: 18px;
  padding: 18px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f4eaea;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  color: #777;
  font-size: 16px;
  font-weight: 700;
`;

export const InfoValue = styled.span`
  color: #111;
  font-size: 16px;
  font-weight: 800;
  text-align: right;
  word-break: break-all;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const BaseButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
`;

export const PrimaryButton = styled(BaseButton)`
  background: #111;
  color: #fff;
`;

export const SecondaryButton = styled(BaseButton)`
  background: #ece6dc;
  color: #111;
`;
