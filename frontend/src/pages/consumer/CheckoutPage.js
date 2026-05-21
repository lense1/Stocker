import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/order";
import * as S from "./CheckoutPageStyles.js";

const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

let kakaoPostcodeScriptPromise = null;

const loadKakaoPostcodeScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경이 아닙니다."));
  }

  if (window.kakao?.Postcode) {
    return Promise.resolve();
  }

  if (kakaoPostcodeScriptPromise) {
    return kakaoPostcodeScriptPromise;
  }

  kakaoPostcodeScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("카카오 우편번호 스크립트 로드에 실패했습니다.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("카카오 우편번호 스크립트 로드에 실패했습니다."));

    document.body.appendChild(script);
  });

  return kakaoPostcodeScriptPromise;
};

const formatPhoneNumber = (value) => {
  const onlyNumber = value.replace(/\D/g, "").slice(0, 11);

  if (onlyNumber.length < 4) return onlyNumber;
  if (onlyNumber.length < 8) {
    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
  }
  return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7)}`;
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const detailAddressRef = useRef(null);

  const orderItems = location.state?.orderItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [shippingInfo, setShippingInfo] = useState({
    receiver: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    message: "",
  });

  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleOpenPostcode = async () => {
    try {
      setIsSearchingAddress(true);
      await loadKakaoPostcodeScript();

      new window.kakao.Postcode({
        oncomplete: function (data) {
          let extraAddress = "";

          if (data.userSelectedType === "R") {
            if (data.bname && /[동|로|가]$/g.test(data.bname)) {
              extraAddress += data.bname;
            }

            if (data.buildingName && data.apartment === "Y") {
              extraAddress += extraAddress
                ? `, ${data.buildingName}`
                : data.buildingName;
            }
          }

          const fullAddress = extraAddress
            ? `${data.address} (${extraAddress})`
            : data.address;

          setShippingInfo((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            address: fullAddress,
          }));

          setTimeout(() => {
            detailAddressRef.current?.focus();
          }, 0);
        },
        onclose: function () {
          setIsSearchingAddress(false);
        },
      }).open();
    } catch (error) {
      console.error(error);
      setIsSearchingAddress(false);
      alert("주소 검색을 불러오지 못했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingInfo.receiver.trim()) {
      alert("받는 사람을 입력해주세요.");
      return;
    }

    if (!shippingInfo.phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (!shippingInfo.zipCode.trim() || !shippingInfo.address.trim()) {
      alert("우편번호 찾기로 주소를 선택해주세요.");
      return;
    }

    if (!shippingInfo.detailAddress.trim()) {
      alert("상세 주소를 입력해주세요.");
      return;
    }

    if (orderItems.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!TOSS_CLIENT_KEY) {
      alert("REACT_APP_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
      return;
    }

    if (!window.TossPayments) {
      alert("토스 SDK가 로드되지 않았습니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        items: orderItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          cart_item_id: item.cartItemId,
        })),
        shipping: {
          recipient_name: shippingInfo.receiver,
          recipient_phone: shippingInfo.phone,
          zipcode: shippingInfo.zipCode,
          address1: shippingInfo.address,
          address2: shippingInfo.detailAddress,
          delivery_request: shippingInfo.message || "",
        },
      };

      const createdOrder = await createOrder(payload);

      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({
        customerKey: `member_order_${createdOrder.order_no}`,
      });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: createdOrder.amount,
        },
        orderId: createdOrder.order_no,
        orderName: createdOrder.order_name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error(error);

      const detail =
        error?.response?.data?.detail ||
        "주문 생성 또는 결제창 호출에 실패했습니다.";

      alert(detail);
      setIsSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <S.Page>
        <S.Inner>
          <S.Title>주문/결제</S.Title>
          <S.EmptyCard>
            <p>선택된 상품이 없습니다.</p>
            <S.BackButton type="button" onClick={() => navigate("/cart")}>
              장바구니로 돌아가기
            </S.BackButton>
          </S.EmptyCard>
        </S.Inner>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Inner>
        <S.Title>주문/결제</S.Title>

        <S.Section>
          <S.SectionTitle>선택 상품</S.SectionTitle>

          <S.ItemList>
            {orderItems.map((item) => (
              <S.ItemCard key={item.id}>
                <S.Thumb src={item.image} alt={item.name} />

                <S.ItemInfo>
                  <S.ItemName>{item.name}</S.ItemName>
                  <S.ItemMeta>
                    {item.price.toLocaleString()}원 × {item.quantity}개
                  </S.ItemMeta>
                </S.ItemInfo>

                <S.ItemTotal>
                  {(item.price * item.quantity).toLocaleString()}원
                </S.ItemTotal>
              </S.ItemCard>
            ))}
          </S.ItemList>
        </S.Section>

        <S.Section>
          <S.SectionTitle>배송지 입력</S.SectionTitle>

          <S.Form onSubmit={handleSubmit}>
            <S.InputGroup>
              <S.Label htmlFor="receiver">받는 사람</S.Label>
              <S.Input
                id="receiver"
                type="text"
                name="receiver"
                value={shippingInfo.receiver}
                onChange={handleChange}
                placeholder="받는 사람 이름"
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="phone">연락처</S.Label>
              <S.Input
                id="phone"
                type="text"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                maxLength={13}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>주소</S.Label>

              <S.ZipcodeRow>
                <S.ZipcodeInput
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  placeholder="우편번호"
                  readOnly
                />
                <S.AddressSearchButton
                  type="button"
                  onClick={handleOpenPostcode}
                  disabled={isSearchingAddress}
                >
                  {isSearchingAddress ? "불러오는 중..." : "우편번호 찾기"}
                </S.AddressSearchButton>
              </S.ZipcodeRow>

              <S.Input
                id="address"
                type="text"
                name="address"
                value={shippingInfo.address}
                placeholder="기본 주소"
                readOnly
              />

              <S.Input
                id="detailAddress"
                ref={detailAddressRef}
                type="text"
                name="detailAddress"
                value={shippingInfo.detailAddress}
                onChange={handleChange}
                placeholder="상세 주소를 입력해주세요."
              />

              <S.HelperText>
                우편번호와 기본주소는 주소 검색으로 자동 입력됩니다.
              </S.HelperText>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="message">배송 요청사항</S.Label>
              <S.TextArea
                id="message"
                name="message"
                value={shippingInfo.message}
                onChange={handleChange}
                placeholder="배송 요청사항을 입력해주세요."
              />
            </S.InputGroup>

            <S.SummaryBox>
              <S.SummaryRow>
                <span>총 주문금액</span>
                <S.TotalPrice>{totalPrice.toLocaleString()}원</S.TotalPrice>
              </S.SummaryRow>

              <S.ButtonRow>
                <S.SecondaryButton
                  type="button"
                  onClick={() => navigate("/cart")}
                  disabled={isSubmitting}
                >
                  장바구니로 가기
                </S.SecondaryButton>
                <S.SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "처리 중..." : "결제하기"}
                </S.SubmitButton>
              </S.ButtonRow>
            </S.SummaryBox>
          </S.Form>
        </S.Section>
      </S.Inner>
    </S.Page>
  );
}
