import React from "react";
import styled from "styled-components";

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  width = 34,
  height = 20,
}) {
  return (
    <SwitchButton
      type="button"
      $checked={checked}
      $width={width}
      $height={height}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange?.(!checked);
      }}
    >
      <SwitchThumb $checked={checked} $width={width} $height={height} />
    </SwitchButton>
  );
}

const SwitchButton = styled.button`
  position: relative;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  border: none;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "#2563eb" : "#d1d5db")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  padding: 0;
  box-sizing: border-box;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;

  &:disabled {
    opacity: 0.65;
  }
`;

const SwitchThumb = styled.span`
  position: absolute;
  top: 50%;
  left: ${({ $checked, $width, $height }) =>
    $checked ? `${$width - $height + 2}px` : "2px"};
  transform: translateY(-50%);
  width: ${({ $height }) => `${$height - 4}px`};
  height: ${({ $height }) => `${$height - 4}px`};
  border-radius: 999px;
  background: #ffffff;
  transition: left 0.15s ease;
`;
