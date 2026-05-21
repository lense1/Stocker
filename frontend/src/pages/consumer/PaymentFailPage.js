import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import * as S from "./PaymentFailPageStyles.js";

export default function PaymentFailPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const message = params.get("message");

  return (
    <S.Page>
      <S.Card>
        <S.IconWrap>
          <AlertCircle size={46} />
        </S.IconWrap>

        <S.Title>결제가 완료되지 않았습니다</S.Title>
        <S.Description>
          결제 과정에서 문제가 발생했어요.
          <br />
          아래 정보를 확인한 뒤 다시 시도해주세요.
        </S.Description>

        <S.InfoBox>
          <S.InfoRow>
            <S.InfoLabel>에러 코드</S.InfoLabel>
            <S.InfoValue>{code || "-"}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>메시지</S.InfoLabel>
            <S.InfoValue>{message || "-"}</S.InfoValue>
          </S.InfoRow>
        </S.InfoBox>

        <S.ButtonRow>
          <S.SecondaryButton type="button" onClick={() => navigate("/cart")}>
            장바구니로 이동
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={() => navigate(-1)}>
            다시 시도하기
          </S.PrimaryButton>
        </S.ButtonRow>
      </S.Card>
    </S.Page>
  );
}
