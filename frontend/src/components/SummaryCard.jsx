import React from "react";
import styled from "styled-components";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function SummaryCard({
  title,
  subText,
  value,

  change,
  up = true,
}) {
  return (
    <Card>
      <Title>{title}</Title>
      <SubText>{subText}</SubText>
      <Value>{value}</Value>

      <Footer $up={up}>
        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change} <span>vs last 7 days</span>
      </Footer>
    </Card>
  );
}

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px;
  min-height: 118px;
  box-shadow: var(--shadow);
`;

const Title = styled.div`
  color: var(--font);
  font-size: 15px;
  font-weight: 700;
`;

const SubText = styled.div`
  color: var(--placeholder);
  font-size: 12px;
`;

const Value = styled.div`
  margin-top: 10px;
  color: var(--font);
  font-size: 24px;
  font-weight: 800;

  span {
    font-size: 18px;
    font-weight: 600;
    color: var(--font);
    margin-left: 4px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $up }) => ($up ? "var(--green)" : "var(--red)")};
  font-size: 12px;
  font-weight: 700;

  span {
    color: var(--placeholder);
    font-weight: 500;
    margin-left: 2px;
  }
`;
