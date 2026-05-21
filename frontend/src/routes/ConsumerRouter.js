import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/consumer/Home";
import AILowestPricePage from "../pages/consumer/AILowestPricePage";
import AllProductsPage from "../pages/consumer/AllProductsPage";
import ProductDetailPage from "../pages/consumer/ProductDetailPage";

export default function ConsumerRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ai-lowest-price" element={<AILowestPricePage />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  );
}
