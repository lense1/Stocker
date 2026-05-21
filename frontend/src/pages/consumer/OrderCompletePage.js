import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Receipt, ShoppingBag } from "lucide-react";
import * as S from "./OrderCompletePageStyles.js";

export default function OrderCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderNo = location.state?.orderNo || "-";
  const paidAt = location.state?.paidAt || null;
  const amount = location.state?.amount || 0;
  const orderName = location.state?.orderName || "주문 상품";

  const formattedPaidAt = paidAt
    ? new Date(paidAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <S.Page>
      <S.Inner>
        <S.HeroCard>
          <S.HeroIconWrap>
            <Check size={42} strokeWidth={3} />
          </S.HeroIconWrap>

          <S.HeroTitle>주문이 완료되었습니다</S.HeroTitle>
          <S.HeroDescription>
            결제가 정상적으로 완료되었어요.
            <br />
            주문 정보를 아래에서 확인할 수 있습니다.
          </S.HeroDescription>
        </S.HeroCard>

        <S.InfoCard>
          <S.InfoHeader>
            <Receipt size={18} />
            <S.InfoTitle>주문 정보</S.InfoTitle>
          </S.InfoHeader>

          <S.InfoTable>
            <S.InfoRow>
              <S.InfoLabel>주문번호</S.InfoLabel>
              <S.InfoValue>{orderNo}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>주문상품</S.InfoLabel>
              <S.InfoValue>{orderName}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>결제금액</S.InfoLabel>
              <S.InfoValue>{amount.toLocaleString()}원</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>결제시각</S.InfoLabel>
              <S.InfoValue>{formattedPaidAt}</S.InfoValue>
            </S.InfoRow>
          </S.InfoTable>
        </S.InfoCard>

        <S.ButtonRow>
          <S.SecondaryButton type="button" onClick={() => navigate("/cart")}>
            <ShoppingBag size={18} />
            장바구니 보기
          </S.SecondaryButton>

          <S.PrimaryButton type="button" onClick={() => navigate("/")}>
            홈으로 가기
          </S.PrimaryButton>
        </S.ButtonRow>
      </S.Inner>
    </S.Page>
  );
}
