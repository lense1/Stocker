import styled from "styled-components";

export const Page = styled.div`
  min-height: calc(100vh - 68px);
  background: #f5f1ea;
  padding: 50px 24px 200px;
`;

export const Inner = styled.div`
  max-width: 980px;
  margin: 0 auto;
`;

export const HeroCard = styled.section`
  background: #ffffff;
  border: 1px solid #ece5db;
  border-radius: 28px;
  padding: 36px 24px 44px;
  text-align: center;
  margin-bottom: 24px;
`;

export const HeroIconWrap = styled.div`
  width: 86px;
  height: 86px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #eaf3ea;
  color: #1f8f45;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroTitle = styled.h1`
  font-size: 30px;
  line-height: 1.2;
  font-weight: 900;
  color: #111111;
  margin-bottom: 12px;
  letter-spacing: -0.04em;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const HeroDescription = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #7b756d;
`;

export const InfoCard = styled.section`
  background: #ffffff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 24px;
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: #111;
`;

export const InfoTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
`;

export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-height: 60px;
  border-bottom: 1px solid #f0ebe4;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #7b756d;
`;

export const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #111111;
  text-align: right;
  word-break: break-word;
`;

export const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const BaseButton = styled.button`
  height: 58px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const PrimaryButton = styled(BaseButton)`
  background: #111111;
  color: #ffffff;
`;

export const SecondaryButton = styled(BaseButton)`
  background: #e9e2d7;
  color: #111111;
`;
