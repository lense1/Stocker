import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/stocker-logo.svg";
import logo2 from "../assets/stocker-logo-2.svg";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import * as S from "./Footer.styles.jsx";

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBannerButtonClick = () => {
    if (isAuthenticated) {
      navigate("/products");
      return;
    }

    navigate("/signup");
  };

  return (
    <S.FooterWrap>
      <S.Inner>
        <S.SignupBanner>
          <S.BannerText>
            {isAuthenticated ? (
              <>
                <S.BannerTopLine>
                  <S.BrandLogoImage2 src={logo2} alt="STOCK+er" />
                </S.BannerTopLine>
                <span>실시간 최저가로 합리적인 쇼핑하기 !</span>
              </>
            ) : (
              <>
                <S.BannerTopLine>
                  <S.BrandLogoImage2 src={logo2} alt="STOCK+er" />
                  <span>회원가입 하고</span>
                </S.BannerTopLine>
                <span>실시간 최저가를 합리적인 쇼핑하기 !</span>
              </>
            )}
          </S.BannerText>

          <S.SignupButton type="button" onClick={handleBannerButtonClick}>
            {isAuthenticated ? "상품 확인" : "회원가입"}
          </S.SignupButton>
        </S.SignupBanner>

        <S.TopSection>
          <S.BrandArea>
            <BrandLogoLink to="/">
              <S.BrandLogoImage src={logo} alt="STOCK+er" />
            </BrandLogoLink>

            <S.BrandDesc>
              비교는 쉽게 즐거운
              <br />
              합리적 소비를 위한 트렌디한 쇼핑 !
            </S.BrandDesc>

            <S.Socials>
              <S.SocialButton type="button">
                <FaFacebookF size={12} />
              </S.SocialButton>
              <S.SocialButton type="button">
                <FaInstagram size={12} />
              </S.SocialButton>
              <S.SocialButton type="button">
                <FaYoutube size={12} />
              </S.SocialButton>
            </S.Socials>
          </S.BrandArea>

          <S.LinkGrid>
            <S.LinkColumn>
              <S.ColumnTitle>COMPANY</S.ColumnTitle>
              <S.FooterLink href="/">About</S.FooterLink>
              <S.FooterLink href="/">Features</S.FooterLink>
              <S.FooterLink href="/">Works</S.FooterLink>
              <S.FooterLink href="/">Career</S.FooterLink>
            </S.LinkColumn>

            <S.LinkColumn>
              <S.ColumnTitle>HELP</S.ColumnTitle>
              <S.FooterLink href="/">Customer Support</S.FooterLink>
              <S.FooterLink href="/">Delivery Details</S.FooterLink>
              <S.FooterLink href="/">Terms & Conditions</S.FooterLink>
              <S.FooterLink href="/">Privacy Policy</S.FooterLink>
            </S.LinkColumn>

            <S.LinkColumn>
              <S.ColumnTitle>FAQ</S.ColumnTitle>
              <S.FooterLink href="/">Account</S.FooterLink>
              <S.FooterLink href="/">Manage Deliveries</S.FooterLink>
              <S.FooterLink href="/">Orders</S.FooterLink>
              <S.FooterLink href="/">Payments</S.FooterLink>
            </S.LinkColumn>

            <S.LinkColumn>
              <S.ColumnTitle>RESOURCES</S.ColumnTitle>
              <S.FooterLink href="/">Free eBooks</S.FooterLink>
              <S.FooterLink href="/">Development Tutorial</S.FooterLink>
              <S.FooterLink href="/">How to - Blog</S.FooterLink>
              <S.FooterLink href="/">Youtube Playlist</S.FooterLink>
            </S.LinkColumn>
          </S.LinkGrid>
        </S.TopSection>

        <S.BottomSection>
          <S.Copyright>© STOCK+er ALL RIGHTS RESERVED</S.Copyright>

        </S.BottomSection>
      </S.Inner>
    </S.FooterWrap>
  );
}

const BrandLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
`;