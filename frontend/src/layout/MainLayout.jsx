import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as S from "./MainLayout.styles.jsx";

export default function MainLayout() {
  return (
    <S.Wrap>
      <Header />
      <S.Content>
        <Outlet />
      </S.Content>
      <Footer />
    </S.Wrap>
  );
}
