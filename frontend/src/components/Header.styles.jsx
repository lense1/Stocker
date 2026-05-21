import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const HeaderShell = styled.div`
  position: sticky;
  top: 0;
  z-index: 1200;
  background: #ffffff;
`;

export const HeaderWrap = styled.header`
  width: 100%;
  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;

  @media (max-width: 900px) {
    padding: 0 20px;
    gap: 16px;
  }
`;

export const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;
`;

export const BrandLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
`;

export const BrandLogoImage = styled.img`
  height: 24px;
  width: auto;
  display: block;
  object-fit: contain;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 6px;

  @media (max-width: 980px) {
    gap: 18px;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

export const NavItem = styled(Link)`
  text-decoration: none;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

export const RightArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
`;

export const SearchForm = styled.form`
  width: 100%;
  max-width: 500px;

  @media (max-width: 760px) {
    max-width: 100%;
  }
`;

export const SearchBox = styled.div`
  width: 100%;
  height: 42px;
  border-radius: 999px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  padding: 0 18px;
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  margin-right: 9px;
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  color: #111;

  &::placeholder {
    color: #9b9b9b;
    font-size: 12px;
  }
`;

export const CartIconButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f8f8;
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  min-width: ${({ $isAuthenticated }) =>
    $isAuthenticated ? "250px" : "252px"};
  justify-content: flex-end;

  @media (max-width: 980px) {
    min-width: auto;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const buttonBase = css`
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.2s ease;
`;

export const GhostActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;

  &:hover {
    background: #f8f8f8;
  }
`;

export const PrimaryActionLink = styled(Link)`
  ${buttonBase}
  border: 1px solid #111;
  background: #111;
  color: #fff;

  &:hover {
    opacity: 0.92;
  }
`;

export const LogoutButton = styled.button`
  ${buttonBase}
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #222;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;
