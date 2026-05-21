import React from "react";
import styled from "styled-components";

export default function RateBadge({ value, isGood = false, minWidth = 54 }) {
  const normalized = String(value ?? "").replace(/\s/g, "");
  const isZero =
    normalized === "0%" ||
    normalized === "+0%" ||
    normalized === "-0%" ||
    normalized === "0.0%" ||
    normalized === "+0.0%" ||
    normalized === "-0.0%" ||
    normalized === "-" ||
    normalized === "";

  return (
    <Badge $isGood={isGood} $isZero={isZero} $minWidth={minWidth}>
      {value}
    </Badge>
  );
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $minWidth }) => `${$minWidth}px`};
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $isZero, $isGood }) => {
    if ($isZero) return "#e5e7eb";
    return $isGood ? "#dcf7e8" : "#ffe7e7";
  }};
  color: ${({ $isZero, $isGood }) => {
    if ($isZero) return "#6b7280";
    return $isGood ? "#18b663" : "#ef5350";
  }};
`;
