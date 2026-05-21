import styled from "styled-components";

export const BrandLogoImage = styled.img`
  height: 28px;
  width: auto;
  display: block;
  object-fit: contain;
  transform: translateY(-10px);
`;

export const BrandLogoImage2 = styled.img`
  height: 20px;
  width: auto;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
`;

export const FooterWrap = styled.footer`
  width: 100%;
  background: #f5f5f5;
  padding: 0 0 28px;
  border-top: 1px solid #ededed;
  overflow: visible;
`;

export const Inner = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
`;

export const SignupBanner = styled.div`
  width: 100%;
  background: #000;
  border-radius: 12px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: -51px;
  margin-bottom: 18px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  color: #fff;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
`;

export const BannerTopLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SignupButton = styled.button`
  min-width: 108px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #111;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 64px;
  align-items: flex-start;
  padding: 24px 0 36px;
  border-bottom: 1px solid #dddddd;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export const BrandArea = styled.div`
  width: 100%;
  max-width: 320px;
`;

export const BrandLogo = styled.h2`
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 800;
  font-style: italic;
  color: #111;
  line-height: 1;
`;

export const BrandDesc = styled.p`
  margin: 0;
  color: #8a8a8a;
  font-size: 12px;
  line-height: 1.8;
`;

export const Socials = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
`;

export const SocialButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #d7d7d7;
  border-radius: 50%;
  background: #fff;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const LinkGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 36px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 28px;
  }
`;

export const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ColumnTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
  color: #444;
`;

export const FooterLink = styled.a`
  text-decoration: none;
  color: #7d7d7d;
  font-size: 12px;
  line-height: 1.7;

  &:hover {
    color: #111;
  }
`;

export const BottomSection = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Copyright = styled.p`
  margin: 0;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 500;
`;

export const PaymentArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaymentBadge = styled.div`
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #dedede;
  color: #444;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;
