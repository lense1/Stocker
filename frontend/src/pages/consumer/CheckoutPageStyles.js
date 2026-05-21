import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  padding: 50px 24px 200px;
`;

export const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  color: #111;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
`;

export const Section = styled.section`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: #111;
  margin-bottom: 20px;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #eee6db;
  border-radius: 18px;
  padding: 18px;
`;

export const Thumb = styled.img`
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 16px;
  background: #f3efe8;
`;

export const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemName = styled.h3`
  font-size: 20px;
  line-height: 1.45;
  font-weight: 800;
  color: #111;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

export const ItemMeta = styled.p`
  font-size: 16px;
  color: #666;
`;

export const ItemTotal = styled.p`
  font-size: 20px;
  font-weight: 900;
  color: #111;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #222;
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border: 1px solid #e5ddd2;
  border-radius: 16px;
  background: #fcfbf8;
  font-size: 16px;
  color: #111;

  &::placeholder {
    color: #a59a8d;
  }

  &:read-only {
    background: #f3efe8;
    color: #666;
  }
`;

export const ZipcodeRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ZipcodeInput = styled(Input)`
  flex: 1;
`;

export const AddressSearchButton = styled.button`
  min-width: 140px;
  height: 56px;
  padding: 0 18px;
  border-radius: 16px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const HelperText = styled.p`
  font-size: 12px;
  color: #7a746d;
  margin-top: 2px;
  line-height: 1.6;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 112px;
  padding: 16px 18px;
  border: 1px solid #e5ddd2;
  border-radius: 16px;
  background: #fcfbf8;
  font-size: 16px;
  color: #111;
  resize: none;

  &::placeholder {
    color: #a59a8d;
  }
`;

export const SummaryBox = styled.div`
  margin-top: 8px;
  padding-top: 8px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
`;

export const TotalPrice = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: #111;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const SubmitButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 16px;
  background: #ece6dc;
  color: #111;
  font-size: 16px;
  font-weight: 800;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const EmptyCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 48px 24px;
  text-align: center;
`;

export const BackButton = styled.button`
  margin-top: 16px;
  padding: 0 20px;
  height: 54px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;
