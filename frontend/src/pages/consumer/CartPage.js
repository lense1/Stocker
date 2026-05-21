import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteCartItem,
  getMyCart,
  updateCartCheckAll,
  updateCartItemChecked,
  updateCartItemQuantity,
} from "../../api/cart";
import * as S from "./CartPageStyles.js";

export default function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoToDetail = (item) => {
    navigate(`/products/${item.productId}`);
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCart();
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "장바구니 조회에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const isAllChecked = useMemo(() => {
    return cartItems.length > 0 && cartItems.every((item) => item.checked);
  }, [cartItems]);

  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => item.checked);
  }, [cartItems]);

  const selectedCount = selectedItems.length;

  const totalPrice = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  }, [selectedItems]);

  const handleToggleItem = async (id, checked) => {
    try {
      const data = await updateCartItemChecked(id, !checked);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "선택 상태 변경에 실패했습니다.");
    }
  };

  const handleToggleAll = async () => {
    try {
      const data = await updateCartCheckAll(!isAllChecked);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "전체 선택 변경에 실패했습니다.");
    }
  };

  const handleIncrease = async (item) => {
    try {
      const data = await updateCartItemQuantity(item.id, item.quantity + 1);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      const data = await updateCartItemQuantity(item.id, item.quantity - 1);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "수량 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteCartItem(id);
      setCartItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "상품 삭제에 실패했습니다.");
    }
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) return;

    navigate("/checkoutPage", {
      state: {
        orderItems: selectedItems.map((item) => ({
          id: item.id,
          cartItemId: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice,
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <S.StateCard>장바구니를 불러오는 중입니다.</S.StateCard>;
    }

    if (cartItems.length === 0) {
      return (
        <S.EmptyWrap>
          <S.EmptyCard>
            <S.EmptyTitle>장바구니가 비어 있어요</S.EmptyTitle>
            <S.EmptyDescription>
              원하는 상품을 담아 주문을 시작해보세요.
            </S.EmptyDescription>
            <S.EmptyButton type="button" onClick={() => navigate("/")}>
              쇼핑 계속하기
            </S.EmptyButton>
          </S.EmptyCard>
        </S.EmptyWrap>
      );
    }

    return (
      <S.ContentGrid>
        <S.LeftColumn>
          <S.TopBar>
            <S.TopBarLeft>
              <S.CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleToggleAll}
                  disabled={isLoading || cartItems.length === 0}
                />
                전체 선택
              </S.CheckboxLabel>
              <S.SelectedMeta>
                선택된 상품 <strong>{selectedCount}</strong>개
              </S.SelectedMeta>
            </S.TopBarLeft>
          </S.TopBar>

          <S.ListSection>
            {cartItems.map((item) => (
              <S.CartCard key={item.id}>
                <S.CheckArea>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleItem(item.id, item.checked)}
                  />
                </S.CheckArea>

                <S.Thumb
                  src={item.image || "https://via.placeholder.com/120"}
                  alt={item.name}
                  onClick={() => handleGoToDetail(item)}
                  style={{ cursor: "pointer" }}
                />

                <S.InfoArea>
                  <S.ProductName
                    onClick={() => handleGoToDetail(item)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.name}
                  </S.ProductName>
                  <S.ProductPrice>
                    {item.price.toLocaleString()}원
                  </S.ProductPrice>

                  <S.QuantityBox>
                    <S.QtyButton
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </S.QtyButton>
                    <S.QtyText>{item.quantity}</S.QtyText>
                    <S.QtyButton
                      type="button"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </S.QtyButton>
                  </S.QuantityBox>
                </S.InfoArea>

                <S.RightArea>
                  <S.ItemTotal>
                    {(item.price * item.quantity).toLocaleString()}원
                  </S.ItemTotal>
                  <S.DeleteButton
                    type="button"
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </S.DeleteButton>
                </S.RightArea>
              </S.CartCard>
            ))}
          </S.ListSection>
        </S.LeftColumn>

        <S.RightColumn>
          <S.SummaryCard>
            <S.SummaryTitle>주문 요약</S.SummaryTitle>

            <S.SummaryRow>
              <span>선택 상품 수</span>
              <span>{selectedCount}개</span>
            </S.SummaryRow>

            <S.SummaryRow>
              <span>총 주문금액</span>
              <S.TotalPrice>{totalPrice.toLocaleString()}원</S.TotalPrice>
            </S.SummaryRow>

            <S.OrderButton
              type="button"
              onClick={handleOrder}
              disabled={isLoading || selectedCount === 0}
            >
              {selectedCount === 0 ? "상품을 선택해주세요" : "주문하기"}
            </S.OrderButton>
          </S.SummaryCard>
        </S.RightColumn>
      </S.ContentGrid>
    );
  };

  return (
    <S.Page>
      <S.Inner>
        <S.Title>장바구니</S.Title>
        {renderContent()}
      </S.Inner>
    </S.Page>
  );
}
