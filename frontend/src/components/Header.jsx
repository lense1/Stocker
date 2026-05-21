import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import logo from "../assets/stocker-logo.svg";
import { useAuth } from "../context/AuthContext";
import * as S from "./Header.styles.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get("keyword") || "").trim();

    if (!keyword) return;

    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <S.HeaderShell>
      <S.HeaderWrap>
        <S.Inner>
          <S.LeftArea>
            <S.BrandLogoLink to="/">
              <S.BrandLogoImage src={logo} alt="STOCK+er" />
            </S.BrandLogoLink>

            <S.Nav>
              <S.NavItem to="/ai-lowest-price">AI 최저가</S.NavItem>
              <S.NavItem to="/products">전체 상품 보기</S.NavItem>
            </S.Nav>
          </S.LeftArea>

          <S.RightArea>
            <S.SearchForm onSubmit={handleSearchSubmit}>
              <S.SearchBox>
                <S.SearchIcon>
                  <Search size={18} />
                </S.SearchIcon>
                <S.SearchInput
                  name="keyword"
                  placeholder="상품명을 검색해보세요"
                />
              </S.SearchBox>
            </S.SearchForm>

            <S.ActionGroup $isAuthenticated={isAuthenticated}>
              {!isInitializing &&
                (isAuthenticated ? (
                  <>
                    <S.GhostActionLink to="/profile">프로필</S.GhostActionLink>

                    <S.CartIconButton
                      type="button"
                      aria-label="장바구니"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart size={18} />
                    </S.CartIconButton>

                    <S.LogoutButton type="button" onClick={handleLogout}>
                      로그아웃
                    </S.LogoutButton>
                  </>
                ) : (
                  <>
                    <S.CartIconButton
                      type="button"
                      aria-label="장바구니"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart size={18} />
                    </S.CartIconButton>

                    <S.GhostActionLink to="/login">로그인</S.GhostActionLink>

                    <S.PrimaryActionLink to="/signup">
                      회원가입
                    </S.PrimaryActionLink>
                  </>
                ))}
            </S.ActionGroup>
          </S.RightArea>
        </S.Inner>
      </S.HeaderWrap>
    </S.HeaderShell>
  );
}
