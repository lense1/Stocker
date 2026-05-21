import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Search, X } from "lucide-react";
import { getAdminProductDetail } from "../../../api/adminProduct";
import SearchDate from "../../../components/SearchDate";

const formatCount = (value) => Number(value || 0).toLocaleString();

const getCurrentStockFromDetail = (detail) => {
  if (!detail || typeof detail !== "object") return 0;

  if (detail.stock_qty != null) {
    return Number(detail.stock_qty || 0);
  }

  if (detail.total_stock != null) {
    return Number(detail.total_stock || 0);
  }

  return 0;
};

export default function InboundRegisterModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [form, setForm] = useState({
    productCode: "",
    productName: "",
    currentStock: 0,
    inboundQty: "",
    expirationDate: "",
  });

  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm({
        productCode: "",
        productName: "",
        currentStock: 0,
        inboundQty: "",
        expirationDate: "",
      });
      setLookupError("");
      setIsFetchingProduct(false);
    }
  }, [open]);

  const totalStock = useMemo(() => {
    return Number(form.currentStock || 0) + Number(form.inboundQty || 0);
  }, [form.currentStock, form.inboundQty]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "productCode") {
      setLookupError("");
      setForm((prev) => ({
        ...prev,
        productCode: value,
        productName: "",
        currentStock: 0,
      }));
    }
  };

  const handleFetchProductByCode = async () => {
    const productCode = form.productCode.trim();

    if (!productCode) {
      setLookupError("상품코드를 입력해주세요.");
      return;
    }

    try {
      setIsFetchingProduct(true);
      setLookupError("");

      const detail = await getAdminProductDetail(productCode);

      setForm((prev) => ({
        ...prev,
        productCode,
        productName: detail?.product_name ?? "",
        currentStock: getCurrentStockFromDetail(detail),
        expirationDate: prev.expirationDate || detail?.expiration_date || "",
      }));
    } catch (error) {
      console.error(error);

      setForm((prev) => ({
        ...prev,
        productName: "",
        currentStock: 0,
      }));

      setLookupError(
        error?.response?.data?.detail || "존재하지 않는 상품코드입니다.",
      );
    } finally {
      setIsFetchingProduct(false);
    }
  };

  const handleProductCodeKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleFetchProductByCode();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productCode = form.productCode.trim();
    const inboundQty = Number(form.inboundQty || 0);

    if (!productCode) {
      setLookupError("상품코드를 입력해주세요.");
      return;
    }

    if (!form.productName) {
      setLookupError("상품코드를 조회해주세요.");
      return;
    }

    if (!Number.isFinite(inboundQty) || inboundQty <= 0) {
      alert("입고 수량은 1개 이상 입력해주세요.");
      return;
    }

    if (!form.expirationDate) {
      alert("유통기한을 입력해주세요.");
      return;
    }

    await onSubmit({
      productCode,
      inboundQty,
      expirationDate: form.expirationDate,
    });
  };

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>입고 등록</ModalTitle>
          <CloseButton
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isFetchingProduct}
            aria-label="닫기"
          >
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>상품정보</SectionTitle>

            <FormRow>
              <FormLabel>상품코드</FormLabel>
              <FormField>
                <CodeInputRow>
                  <Input
                    value={form.productCode}
                    onChange={(e) =>
                      handleChange("productCode", e.target.value)
                    }
                    onKeyDown={handleProductCodeKeyDown}
                    placeholder="상품코드를 입력하세요"
                    disabled={isSubmitting || isFetchingProduct}
                  />
                  <SearchButton
                    type="button"
                    onClick={handleFetchProductByCode}
                    disabled={isSubmitting || isFetchingProduct}
                  >
                    <Search size={15} />
                    조회
                  </SearchButton>
                </CodeInputRow>

                {lookupError ? <ErrorText>{lookupError}</ErrorText> : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>상품명</FormLabel>
              <FormField>
                <Input
                  value={form.productName}
                  placeholder="상품코드 조회 시 자동 표시"
                  readOnly
                />
              </FormField>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>입고정보</SectionTitle>

            <FormRow>
              <FormLabel>현재재고</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input value={formatCount(form.currentStock)} readOnly />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>입고 수량</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    type="number"
                    min="1"
                    value={form.inboundQty}
                    onChange={(e) => handleChange("inboundQty", e.target.value)}
                    placeholder="입고 수량 입력"
                    disabled={isSubmitting}
                  />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>총 수량</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input value={formatCount(totalStock)} readOnly />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>유통기한</FormLabel>
              <FormField>
                <SearchDate
                  type="single"
                  selected={form.expirationDate}
                  onChange={(date) => handleChange("expirationDate", date)}
                  width="100%"
                  border={true}
                  shadow={false}
                />
              </FormField>
            </FormRow>
          </Section>

          <ButtonRow>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isFetchingProduct}
            >
              취소
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={isSubmitting || isFetchingProduct}
            >
              {isSubmitting ? "등록 중..." : "입고등록"}
            </SubmitButton>
          </ButtonRow>
        </Form>
      </ModalCard>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.34);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 28px 28px 24px;
  box-sizing: border-box;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--font);
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  color: var(--font);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const SectionTitle = styled.div`
  margin-top: 6px;
  margin-bottom: 2px;
  color: var(--font);
  font-size: 16px;
  font-weight: 700;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
`;

const FormLabel = styled.label`
  color: var(--font);
  font-size: 14px;
  font-weight: 500;
`;

const FormField = styled.div`
  min-width: 0;
`;

const CodeInputRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 14px;
  box-sizing: border-box;
  color: var(--font);
  font-size: 14px;
  background: ${({ readOnly }) => (readOnly ? "var(--read-only)" : "#ffffff")};

  &:focus {
    outline: none;
    border-color: var(--blue);
  }

  &:read-only {
    color: var(--font);
  }

  &::placeholder {
    color: var(--placeholder);
  }
`;

const SearchButton = styled.button`
  min-width: 96px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }
`;

const UnitInputWrap = styled.div`
  position: relative;
`;

const UnitText = styled.span`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
`;

const ErrorText = styled.div`
  margin-top: 6px;
  color: var(--red);
  font-size: 12px;
  font-weight: 500;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const BaseButton = styled.button`
  min-width: 104px;
  height: 40px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const CancelButton = styled(BaseButton)`
  min-width: 96px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

const SubmitButton = styled(BaseButton)`
  min-width: 96px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
