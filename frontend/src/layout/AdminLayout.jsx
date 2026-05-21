import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Wrap>
      {isSidebarOpen && (
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      )}

      <Content>
        {!isSidebarOpen && (
          <OpenSidebarButton
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="사이드바 열기"
          >
            <ChevronRight size={18} />
          </OpenSidebarButton>
        )}

        <Outlet />
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6f8;
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
  position: relative;
`;

const OpenSidebarButton = styled.button`
  position: fixed;
  top: 88px;
  left: 0;
  transform: translateX(-30%);
  z-index: 1100;
  width: 23px;
  height: 64px;
  border: none;
  border-radius: 0 12px 12px 0;
  background: #ffffff;
  color: #6b7280;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateX(0);
    background: #f8fafc;
    color: #111827;
  }

  svg {
    flex-shrink: 0;
  }
`;
