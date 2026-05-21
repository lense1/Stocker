import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/consumer/Home";
import Login from "./pages/consumer/Login";
import Signup from "./pages/consumer/Signup";
import SocialLoginCallback from "./pages/consumer/SocialLoginCallback";
import ProductDetailPage from "./pages/consumer/ProductDetailPage";
import CartPage from "./pages/consumer/CartPage";
import CheckoutPage from "./pages/consumer/CheckoutPage";
import PaymentSuccessPage from "./pages/consumer/PaymentSuccessPage";
import PaymentFailPage from "./pages/consumer/PaymentFailPage";
import OrderCompletePage from "./pages/consumer/OrderCompletePage";
import AILowestPricePage from "./pages/consumer/AILowestPricePage";
import AllProductsPage from "./pages/consumer/AllProductsPage";
import Profile from "./pages/consumer/Profile";
import Orders from "./pages/consumer/Orders";
import ScrollToTop from "./pages/consumer/ScrollToTop";

import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/products/ProductList";
import ProductRegist from "./pages/admin/products/ProductRegist";
import ProductUpdate from "./pages/admin/products/ProductUpdate";
import PriceSearch from "./pages/admin/price/PriceSearch";
import MatchingManage from "./pages/admin/price/MatchingManage";
import AIHistory from "./pages/admin/price/AIHistory";
import LiveInventory from "./pages/admin/inventory/LiveInventory";
import InventoryHistory from "./pages/admin/inventory/InventoryHistory";
import SalesStat from "./pages/admin/statistics/SalesStat";
import AIPriceStat from "./pages/admin/statistics/AIPriceStat";
import AdminLogin from "./pages/admin/AdminLogin";

import NotLoginRoute from "./routes/NotLoginRoute";

import NetworkStatusBanner from "./components/NetworkStatusBanner";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <NetworkStatusBanner />
        <ScrollToTop />
        <Routes>
          {/* Consumer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ai-lowest-price" element={<AILowestPricePage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
            <Route
              path="/products/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkoutPage" element={<CheckoutPage />} />
            <Route path="/order-complete" element={<OrderCompletePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          <Route element={<NotLoginRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 나중에 권한 분기 필요할 때 주석 풀기 ㄱㄱ혓 */}
          <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="product-list" element={<ProductList />} />
            <Route path="product-regist" element={<ProductRegist />} />
            <Route
              path="product-update/:productCode"
              element={<ProductUpdate />}
            />

            <Route path="price-search" element={<PriceSearch />} />
            <Route path="matching-manage" element={<MatchingManage />} />
            <Route path="ai-history" element={<AIHistory />} />

            <Route path="live-inventory" element={<LiveInventory />} />
            <Route path="inventory-history" element={<InventoryHistory />} />

            <Route path="sales-stat" element={<SalesStat />} />
            <Route path="ai-price-stat" element={<AIPriceStat />} />
          </Route>
          </Route>

          <Route
            path="/auth/google/callback"
            element={<SocialLoginCallback />}
          />
          <Route
            path="/auth/kakao/callback"
            element={<SocialLoginCallback />}
          />
          <Route
            path="/auth/naver/callback"
            element={<SocialLoginCallback />}
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
