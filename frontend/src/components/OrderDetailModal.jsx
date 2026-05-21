import React from "react";
import styled from "styled-components";
import { X } from "lucide-react";

function formatCurrency(value) {
  const num = Number(value || 0);
  return `${num.toLocaleString()}원`;
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function getStatusLabel(status) {
  const key = String(status || "").toUpperCase();

  switch (key) {
    case "PAID":
      return "결제완료";
    case "PENDING":
      return "결제대기";
    case "READY":
      return "배송준비";
    case "SHIPPING":
      return "배송중";
    case "DELIVERED":
      return "배송완료";
    case "CANCELLED":
      return "취소됨";
    case "FAILED":
      return "실패";
    default:
      return status || "-";
  }
}

function getStatusTone(status) {
  const key = String(status || "").toUpperCase();

  if (["PAID", "DELIVERED"].includes(key)) return "success";
  if (["READY", "SHIPPING", "PENDING"].includes(key)) return "warning";
  if (["CANCELLED", "FAILED"].includes(key)) return "danger";
  return "default";
}

export default function OrderDetailModal({ open, order, onClose }) {
  if (!open || !order) return null;

  const totalProductAmount = Number(order.totalProductAmount || 0);
  const shippingFee =
    order.shippingFee != null ? Number(order.shippingFee) : 3000;
  const totalAmount = Number(order.totalAmount || 0);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>주문 상세</ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DetailGrid>
            <DetailRow>
              <DetailLabel>주문번호</DetailLabel>
              <DetailValue>{order.orderNumber}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>주문일시</DetailLabel>
              <DetailValue>{formatDateTime(order.createdAt)}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>주문상태</DetailLabel>
              <DetailValue>
                <StatusBadge $tone={getStatusTone(order.status)}>
                  {getStatusLabel(order.status)}
                </StatusBadge>
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>총 주문 상품 금액</DetailLabel>
              <DetailValue>{formatCurrency(totalProductAmount)}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>배송비</DetailLabel>
              <DetailValue>{formatCurrency(shippingFee)}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>총 결제 금액</DetailLabel>
              <StrongValue>{formatCurrency(totalAmount)}</StrongValue>
            </DetailRow>
          </DetailGrid>
        </ModalBody>

        <ModalFooter>
          <FooterButton type="button" onClick={onClose}>
            닫기
          </FooterButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  height: 60px;
  padding: 0 18px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.div`
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: #f3f4f6;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 20px 18px;
`;

const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
`;

const DetailLabel = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`;

const DetailValue = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  word-break: break-word;
`;

const StrongValue = styled(DetailValue)`
  font-size: 15px;
  font-weight: 800;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 82px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $tone }) => {
    if ($tone === "success") return "#dcfce7";
    if ($tone === "warning") return "#fef3c7";
    if ($tone === "danger") return "#fee2e2";
    return "#e5e7eb";
  }};
  color: ${({ $tone }) => {
    if ($tone === "success") return "#16a34a";
    if ($tone === "warning") return "#d97706";
    if ($tone === "danger") return "#dc2626";
    return "#6b7280";
  }};
`;

const ModalFooter = styled.div`
  padding: 16px 18px 18px;
  border-top: 1px solid #eef2f7;
  display: flex;
  justify-content: flex-end;
`;

const FooterButton = styled.button`
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #111827;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;
