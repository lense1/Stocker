import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const location = useLocation();
  const { isInitializing, isAuthenticated, member } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (member?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}