import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmTossPayment } from "../../api/payment";
import * as S from "./PaymentSuccessPageStyles.js";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("결제 승인 처리 중입니다...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);

      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = Number(params.get("amount"));

      if (!paymentKey || !orderId || !amount) {
        setIsError(true);
        setMessage("결제 성공 파라미터가 올바르지 않습니다.");
        return;
      }

      try {
        const result = await confirmTossPayment({
          paymentKey,
          orderId,
          amount,
        });

        navigate("/order-complete", {
          replace: true,
          state: {
            orderNo: result.order_no,
            paymentStatus: result.payment_status,
            paidAt: result.paid_at,
            amount,
            orderName: result.order_name || "주문 상품",
          },
        });
      } catch (error) {
        console.error(error);
        setIsError(true);
        setMessage(
          error?.response?.data?.detail || "결제 승인 처리에 실패했습니다.",
        );
      }
    };

    run();
  }, [navigate]);

  return (
    <S.Page>
      <S.Card>
        <S.Title>{isError ? "결제 처리 실패" : "결제 승인 처리 중"}</S.Title>
        <S.Description>{message}</S.Description>

        {isError && (
          <S.ButtonRow>
            <S.SecondaryButton type="button" onClick={() => navigate("/cart")}>
              장바구니로 이동
            </S.SecondaryButton>
            <S.PrimaryButton type="button" onClick={() => navigate("/")}>
              홈으로 가기
            </S.PrimaryButton>
          </S.ButtonRow>
        )}
      </S.Card>
    </S.Page>
  );
}
