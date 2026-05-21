import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  padding: 50px 24px 200px;
`;

export const Inner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  color: #111;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  min-width: 0;
`;

export const RightColumn = styled.div`
  position: sticky;
  top: 92px;

  @media (max-width: 980px) {
    position: static;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #222;
  font-weight: 700;
`;

export const SelectedMeta = styled.div`
  font-size: 12px;
  color: #6f675d;

  strong {
    color: #111;
    font-weight: 800;
  }
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CartCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 24px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 20px;
  }
`;

export const CheckArea = styled.div`
  flex-shrink: 0;
  padding-top: 4px;
`;

export const Thumb = styled.img`
  width: 132px;
  height: 132px;
  object-fit: cover;
  border-radius: 18px;
  background: #f3efe8;
  flex-shrink: 0;

  @media (max-width: 680px) {
    width: 104px;
    height: 104px;
  }
`;

export const InfoArea = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
  line-height: 1.45;
  letter-spacing: -0.02em;
`;

export const ProductPrice = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 16px;
`;

export const QuantityBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #ddd3c6;
  border-radius: 12px;
  padding: 8px 12px;
  background: #fff;
`;

export const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f6f1ea;
  color: #111;
  font-size: 16px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const QtyText = styled.span`
  min-width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
`;

export const RightArea = styled.div`
  min-width: 132px;
  text-align: right;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 680px) {
    width: 100%;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
  }
`;

export const ItemTotal = styled.p`
  font-size: 20px;
  font-weight: 900;
  color: #111;
`;

export const DeleteButton = styled.button`
  font-size: 12px;
  color: #8a8176;
  align-self: flex-end;
`;

export const SummaryCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 24px;
  margin-top: 40px;
`;

export const SummaryTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: #111;
  margin-bottom: 20px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  color: #333;
`;

export const TotalPrice = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: #111;
`;

export const OrderButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  margin-top: 18px;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const StateCard = styled.div`
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 44px 24px;
  text-align: center;
  color: #777;
  font-size: 16px;
`;

export const EmptyWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export const EmptyCard = styled.div`
  width: 100%;
  max-width: 640px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 54px 24px;
  text-align: center;
`;

export const EmptyTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: #111;
  margin-bottom: 12px;
`;

export const EmptyDescription = styled.p`
  font-size: 16px;
  color: #6f675d;
  line-height: 1.7;
  margin-bottom: 24px;
`;

export const EmptyButton = styled.button`
  min-width: 180px;
  height: 54px;
  padding: 0 20px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;
