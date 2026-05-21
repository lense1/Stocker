import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Star,
  Box,
  FileText,
  PlusCircle,
  Search,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  PanelLeftClose,
  SquarePlus,
} from "lucide-react";

export default function AdminSidebar({ onClose }) {
  const menuSections = useMemo(
    () => [
      {
        key: "products",
        title: "PRODUCTS",
        defaultOpen: true,
        items: [
          { label: "상품 목록", to: "/admin/product-list", icon: Box },
          { label: "상품 등록", to: "/admin/product-regist", icon: SquarePlus },
        ],
      },
      {
        key: "price",
        title: "PRICE",
        defaultOpen: true,
        items: [
          { label: "가격 관리", to: "/admin/price-search", icon: Search },
          {
            label: "매칭 관리",
            to: "/admin/matching-manage",
            icon: PlusCircle,
          },
          { label: "AI 이력", to: "/admin/ai-history", icon: PlusCircle },
        ],
      },
      {
        key: "inventory",
        title: "INVENTORY",
        defaultOpen: true,
        items: [
          {
            label: "실시간 재고 현황",
            to: "/admin/live-inventory",
            icon: ShoppingCart,
          },
          {
            label: "입출고 이력 조회",
            to: "/admin/inventory-history",
            icon: ClipboardList,
          },
        ],
      },
      {
        key: "statistics",
        title: "STATISTICS",
        defaultOpen: true,
        items: [
          {
            label: "판매 현황",
            to: "/admin/sales-stat",
            icon: BarChart3,
          },
          {
            label: "AI 가격변경 분석",
            to: "/admin/ai-price-stat",
            icon: FileText,
          },
        ],
      },
    ],
    [],
  );

  const [openSections, setOpenSections] = useState(() =>
    menuSections.reduce((acc, section) => {
      acc[section.key] = section.defaultOpen;
      return acc;
    }, {}),
  );

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SidebarWrap>
      <TopArea>
        <BrandWrap>
          <BrandMark>S</BrandMark>
          <BrandText>STOCK+er</BrandText>
        </BrandWrap>

        <TopIconButton
          type="button"
          onClick={onClose}
          aria-label="사이드바 닫기"
        >
          <PanelLeftClose size={18} />
        </TopIconButton>
      </TopArea>

      <DashboardButton to="/admin" end>
        <LayoutDashboard size={18} />
        <span>대시보드</span>
      </DashboardButton>

      <MenuArea>
        {menuSections.map((section) => (
          <Section key={section.key}>
            <SectionHeader
              type="button"
              onClick={() => toggleSection(section.key)}
            >
              <SectionTitle>
                {section.key === "favorite" && <Star size={12} />}
                {section.title}
              </SectionTitle>

              {openSections[section.key] ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </SectionHeader>

            {openSections[section.key] && (
              <ItemList>
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <MenuItem key={item.label} to={item.to}>
                      <MenuIconWrap>
                        <Icon size={18} />
                      </MenuIconWrap>
                      <span>{item.label}</span>
                    </MenuItem>
                  );
                })}
              </ItemList>
            )}
          </Section>
        ))}
      </MenuArea>
    </SidebarWrap>
  );
}

const SidebarWrap = styled.aside`
  width: 250px;
  min-width: 250px;
  min-height: 100vh;
  padding: 22px 14px 28px;
  background: white;
  border-right: 1px solid var(--border);
  overflow-y: visible;

  scrollbar-width: thin;
  scrollbar-color: #cfd4dc transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cfd4dc;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b8bec8;
  }
`;

const TopArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding: 0 4px;
`;

const BrandWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandMark = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--blue);
  color: white;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandText = styled.div`
  color: black;
  font-size: 20px;
  font-weight: 800;
  font-style: italic;
  line-height: 1;
`;

const TopIconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--placeholder);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: var(--hover-gray);
  }
`;

const DashboardButton = styled(NavLink)`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  color: var(--placeholder);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 22px;

  svg {
    color: var(--placeholder);
    flex-shrink: 0;
  }

  &:hover {
    background: var(--hover-gray);
    color: black;
  }

  &.active {
    background: var(--hover-gray);
    color: black;
  }

  &.active svg {
    color: #4b5563;
  }
`;

const MenuArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Section = styled.div``;

const SectionHeader = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0 14px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--placeholder);
  cursor: pointer;
`;

const SectionTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

const ItemList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItem = styled(NavLink)`
  width: 100%;
  min-height: 42px;
  border-radius: 10px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--placeholder);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;

  svg {
    color: var(--placeholder);
    flex-shrink: 0;
  }

  &:hover {
    background: var(--hover-gray);
    color: black;
  }

  &.active {
    background: var(--hover-gray);
    color: black;
    font-weight: 700;
  }

  &.active svg {
    color: #4b5563;
  }
`;

const MenuIconWrap = styled.div`
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
