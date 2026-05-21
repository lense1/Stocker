import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  Package,
  ChevronRight,
  BadgeInfo,
  Receipt,
  MapPin,
} from "lucide-react";
import OrderDetailModal from "../../components/OrderDetailModal";
import { getMe, logout } from "../../api/auth";
import { getMyCart } from "../../api/cart";
import { getMyOrders } from "../../api/orderRead";
import { clearTokens, getRefreshToken } from "../../auth/tokenStorage";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return `${num.toLocaleString()}원`;
}

function getProviderLabel(user) {
  const provider =
    user?.social_type ||
    user?.provider ||
    user?.socialType ||
    user?.login_type ||
    "LOCAL";

  switch (String(provider).toUpperCase()) {
    case "GOOGLE":
      return "구글";
    case "KAKAO":
      return "카카오";
    case "NAVER":
      return "네이버";
    case "LOCAL":
    default:
      return "일반";
  }
}

function getUserName(user) {
  return (
    user?.name ||
    user?.nickname ||
    user?.member_name ||
    user?.username ||
    "회원"
  );
}

function getUserPhone(user) {
  return user?.phone || user?.phone_number || user?.mobile || "-";
}

function normalizeCartCount(cartData) {
  if (!cartData) return 0;

  if (typeof cartData.item_count === "number") return cartData.item_count;
  if (typeof cartData.cart_item_count === "number")
    return cartData.cart_item_count;
  if (typeof cartData.total_item_count === "number")
    return cartData.total_item_count;
  if (Array.isArray(cartData.items)) return cartData.items.length;
  if (Array.isArray(cartData.cart_items)) return cartData.cart_items.length;

  return 0;
}

function normalizeOrders(orderData) {
  if (!orderData) return [];

  const items = Array.isArray(orderData)
    ? orderData
    : orderData.items || orderData.orders || [];

  return items.map((item, index) => ({
    id: item.id || index,
    orderNumber: item.order_number || item.orderNo || item.order_no || "-",
    status: item.status || item.order_status || item.payment_status || "-",
    totalProductAmount:
      item.total_product_amount ?? item.totalProductAmount ?? 0,
    shippingFee: item.total_shipping_fee ?? item.shippingFee ?? 3000,
    totalAmount:
      item.total_payment_amount ??
      item.total_amount ??
      item.totalAmount ??
      item.amount ??
      0,
    createdAt: item.ordered_at || item.created_at || item.createdAt || null,
  }));
}

export default function Profile() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const [meResult, cartResult, orderResult] = await Promise.allSettled([
          getMe(),
          getMyCart(),
          getMyOrders(),
        ]);

        if (meResult.status === "fulfilled") {
          setUser(meResult.value);
        } else {
          throw meResult.reason;
        }

        if (cartResult.status === "fulfilled") {
          setCartCount(normalizeCartCount(cartResult.value));
        } else {
          setCartCount(0);
        }

        if (orderResult.status === "fulfilled") {
          setOrders(normalizeOrders(orderResult.value));
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error?.response?.data?.detail || "프로필 정보를 불러오지 못했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const joinedAt = useMemo(() => {
    return formatDate(user?.created_at || user?.createdAt || user?.joined_at);
  }, [user]);

  const providerLabel = useMemo(() => getProviderLabel(user), [user]);

  const summary = useMemo(() => {
    const recentOrders = orders.slice(0, 3);
    const totalOrderCount = orders.length;
    const totalOrderAmount = orders.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
    );

    return {
      recentOrders,
      totalOrderCount,
      totalOrderAmount,
    };
  }, [orders]);

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (error) {
      console.error(error);
    } finally {
      clearTokens();
      nav("/login", { replace: true });
    }
  };

  if (loading) {
    return <PageState>프로필 정보를 불러오는 중입니다.</PageState>;
  }

  if (errorMessage) {
    return <PageState>{errorMessage}</PageState>;
  }

  return (
    <PageWrap>
      <PageTitle>프로필</PageTitle>

      <TopGrid>
        <ProfileCard>
          <ProfileTop>
            <AvatarCircle>
              <User size={28} />
            </AvatarCircle>

            <ProfileMeta>
              <UserName>{getUserName(user)}</UserName>
              <UserEmail>{user?.email || "-"}</UserEmail>

              <BadgeRow>
                <InfoBadge>{providerLabel} 회원</InfoBadge>
                <InfoBadge>가입일 {joinedAt}</InfoBadge>
              </BadgeRow>
            </ProfileMeta>
          </ProfileTop>

          <ActionRow>
            <PrimaryButton type="button" onClick={() => nav("/cart")}>
              <ShoppingCart size={16} />
              장바구니 가기
            </PrimaryButton>

            <SecondaryButton type="button" onClick={handleLogout}>
              <LogOut size={16} />
              로그아웃
            </SecondaryButton>
          </ActionRow>
        </ProfileCard>

        <InfoCard>
          <SectionTitle>회원 정보</SectionTitle>

          <InfoList>
            <InfoItem>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{getUserName(user)}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>{user?.email || "-"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>전화번호</InfoLabel>
              <InfoValue>{getUserPhone(user)}</InfoValue>
            </InfoItem>
          </InfoList>
        </InfoCard>
      </TopGrid>

      <SummaryGrid>
        <SummaryCard type="button" onClick={() => nav("/cart")}>
          <SummaryIcon>
            <ShoppingCart size={18} />
          </SummaryIcon>
          <SummaryLabel>장바구니</SummaryLabel>
          <SummaryValue>{cartCount}개</SummaryValue>
        </SummaryCard>

        <SummaryCard type="button" onClick={() => nav("/orders")}>
          <SummaryIcon>
            <Package size={18} />
          </SummaryIcon>
          <SummaryLabel>주문 건수</SummaryLabel>
          <SummaryValue>{summary.totalOrderCount}건</SummaryValue>
        </SummaryCard>

        <SummaryCard type="button" onClick={() => nav("/orders")}>
          <SummaryIcon>
            <Receipt size={18} />
          </SummaryIcon>
          <SummaryLabel>누적 주문금액</SummaryLabel>
          <SummaryValue>
            {formatCurrency(summary.totalOrderAmount)}
          </SummaryValue>
        </SummaryCard>

        <SummaryCard type="button" onClick={() => nav("/address-book")}>
          <SummaryIcon>
            <MapPin size={18} />
          </SummaryIcon>
          <SummaryLabel>배송지 관리</SummaryLabel>
          <SummaryValue>이동</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <BottomGrid>
        <SectionCard>
          <SectionHeader>
            <SectionTitle>최근 주문</SectionTitle>
            <MoreButton type="button" onClick={() => nav("/orders")}>
              전체보기
              <ChevronRight size={16} />
            </MoreButton>
          </SectionHeader>

          {summary.recentOrders.length === 0 ? (
            <EmptyText>최근 주문 내역이 없습니다.</EmptyText>
          ) : (
            <OrderList>
              {summary.recentOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <OrderMain>
                    <OrderNo>{order.orderNumber}</OrderNo>
                    <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                  </OrderMain>

                  <OrderMeta>
                    <OrderStatus>{order.status}</OrderStatus>
                    <OrderAmount>
                      {formatCurrency(order.totalAmount)}
                    </OrderAmount>
                  </OrderMeta>
                </OrderItem>
              ))}
            </OrderList>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>빠른 메뉴</SectionTitle>
          </SectionHeader>

          <MenuList>
            <MenuButton type="button" onClick={() => nav("/cart")}>
              <MenuLeft>
                <ShoppingCart size={16} />
                장바구니 확인
              </MenuLeft>
              <ChevronRight size={16} />
            </MenuButton>

            <MenuButton type="button" onClick={() => nav("/orders")}>
              <MenuLeft>
                <Package size={16} />
                주문 내역 확인
              </MenuLeft>
              <ChevronRight size={16} />
            </MenuButton>

            <MenuButton type="button" onClick={() => nav("/address-book")}>
              <MenuLeft>
                <MapPin size={16} />
                배송지 관리
              </MenuLeft>
              <ChevronRight size={16} />
            </MenuButton>
          </MenuList>
        </SectionCard>
      </BottomGrid>
      <OrderDetailModal
        open={isModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </PageWrap>
  );
}

const PageState = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 15px;
  font-weight: 600;
`;

const PageWrap = styled.div`
  min-height: 100vh;
  padding: 32px 24px 48px;
  background: #f8fafc;
`;

const PageTitle = styled.h2`
  margin: 0 0 18px;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
`;

const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AvatarCircle = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfileMeta = styled.div`
  min-width: 0;
`;

const UserName = styled.div`
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const UserEmail = styled.div`
  margin-top: 6px;
  color: #6b7280;
  font-size: 14px;
  word-break: break-word;
`;

const BadgeRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InfoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
`;

const ActionRow = styled.div`
  margin-top: 22px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: #111827;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const InfoCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
`;

const SectionTitle = styled.div`
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const InfoList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
`;

const InfoLabel = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`;

const InfoValue = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.button`
  border: none;
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
  cursor: pointer;
`;

const SummaryIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SummaryLabel = styled.div`
  margin-top: 14px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  margin-top: 6px;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MoreButton = styled.button`
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const EmptyText = styled.div`
  color: #9ca3af;
  font-size: 14px;
  font-weight: 600;
  padding: 28px 0;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const OrderItem = styled.div`
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: #fafcff;
    border-color: #dbe4f0;
  }
`;

const OrderMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const OrderNo = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 800;
`;

const OrderDate = styled.div`
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
`;

const OrderMeta = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const OrderStatus = styled.div`
  color: #374151;
  font-size: 13px;
  font-weight: 700;
`;

const OrderAmount = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 800;
`;

const MenuList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuButton = styled.button`
  height: 50px;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #ffffff;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111827;
  cursor: pointer;
`;

const MenuLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
`;
