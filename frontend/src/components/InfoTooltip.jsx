import React from "react";
import styled from "styled-components";
import { Info } from "lucide-react";

export default function InfoTooltip({
  title,
  lines = [],
  width = 320,
  iconSize = 14,
  ariaLabel,
}) {
  return (
    <TooltipWrap>
      <InfoButton type="button" aria-label={ariaLabel || `${title} 설명`}>
        <Info size={iconSize} />
      </InfoButton>

      <TooltipBox $width={width}>
        {title ? <TooltipTitle>{title}</TooltipTitle> : null}

        {lines.map((line, index) => (
          <TooltipLine key={`${title || "tooltip"}-${index}`}>
            {line}
          </TooltipLine>
        ))}
      </TooltipBox>
    </TooltipWrap>
  );
}

const TooltipWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover > div {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const InfoButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
`;

const TooltipBox = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: ${({ $width }) => `${$width}px`};
  padding: 12px 14px;
  border-radius: 12px;
  background: #111827;
  color: #f9fafb;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.22);
  z-index: 30;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    visibility 0.18s ease;

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 10px;
    width: 12px;
    height: 12px;
    background: #111827;
    transform: rotate(45deg);
  }
`;

const TooltipTitle = styled.div`
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
`;

const TooltipLine = styled.div`
  font-size: 12px;
  line-height: 1.55;
  color: #e5e7eb;

  & + & {
    margin-top: 6px;
  }
`;
