import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { ChevronDown, Check } from "lucide-react";

const STATUS_PALETTE = {
  판매종료: { color: "#33189D", bg: "#EFECFA", variant: "purple" },
  판매중지: { color: "#b99306", bg: "#FFF6D6", variant: "warning" },
  판매중: { color: "#1EB564", bg: "#EEFBF4", variant: "success" },
  품절: { color: "#EA5455 ", bg: "#fceeef", variant: "danger" },
  판매예정: { color: "#0FB7FF", bg: "#F0FAFF", variant: "info" },
};

const VARIANT_COLOR_MAP = {
  success: { color: "#1EB564", bg: "#EEFBF4" },
  info: { color: "#0FB7FF", bg: "#F0FAFF" },
  warning: { color: "#b99306", bg: "#FFF6D6" },
  danger: { color: "#EA5455 ", bg: "#fceeef" },
  purple: { color: "#33189D", bg: "#EFECFA" },
};

const MENU_WIDTH = 180;
const MENU_GAP = 6;
const VIEWPORT_GAP = 8;

export default function StatusBadge({
  value,
  children,
  variant,
  mode = "view",
  options = [],
  onChange,
  width = "110px",
  disabled = false,
}) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({
    top: 0,
    left: 0,
    width: MENU_WIDTH,
  });

  const displayValue = value ?? children ?? "";

  const currentStyle =
    STATUS_PALETTE[displayValue] ||
    VARIANT_COLOR_MAP[variant] ||
    VARIANT_COLOR_MAP.warning;

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = MENU_WIDTH;

    let left = rect.right - menuWidth;
    let top = rect.bottom + MENU_GAP;

    if (left < VIEWPORT_GAP) left = VIEWPORT_GAP;
    if (left + menuWidth > window.innerWidth - VIEWPORT_GAP) {
      left = window.innerWidth - menuWidth - VIEWPORT_GAP;
    }

    const estimatedMenuHeight = Math.max(options.length * 38 + 12, 80);
    if (top + estimatedMenuHeight > window.innerHeight - VIEWPORT_GAP) {
      top = rect.top - estimatedMenuHeight - MENU_GAP;
      if (top < VIEWPORT_GAP) top = VIEWPORT_GAP;
    }

    setMenuStyle({ top, left, width: menuWidth });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const handleOutsideClick = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", updateMenuPosition);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, options.length]);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  const handleToggle = (event) => {
    event.stopPropagation();
    if (disabled) return;
    if (!open) updateMenuPosition();
    setOpen((prev) => !prev);
  };

  const badgeStyle = `
    background: ${currentStyle.bg};
    color: ${currentStyle.color};
  `;

  if (mode === "select") {
    return (
      <>
        <DropdownRoot ref={rootRef} $width={width}>
          <TriggerButton
            ref={triggerRef}
            type="button"
            $customStyle={badgeStyle}
            disabled={disabled}
            onClick={handleToggle}
          >
            <TriggerText>{displayValue}</TriggerText>
            <TriggerIcon $open={open}>
              <ChevronDown size={14} />
            </TriggerIcon>
          </TriggerButton>
        </DropdownRoot>

        {open &&
          createPortal(
            <PortalMenu
              ref={menuRef}
              style={{
                top: `${menuStyle.top}px`,
                left: `${menuStyle.left}px`,
                width: `${menuStyle.width}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {options.map((option) => {
                const optionStyle =
                  STATUS_PALETTE[option.label] || VARIANT_COLOR_MAP.warning;
                const isSelected = option.label === displayValue;

                return (
                  <MenuItem
                    key={option.value}
                    type="button"
                    $selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                  >
                    <ItemLeft>
                      <ColorDot $color={optionStyle.color} />
                      <ItemLabel>{option.label}</ItemLabel>
                    </ItemLeft>
                    {isSelected && (
                      <SelectedIcon>
                        <Check size={14} />
                      </SelectedIcon>
                    )}
                  </MenuItem>
                );
              })}
            </PortalMenu>,
            document.body,
          )}
      </>
    );
  }

  return (
    <Badge $customStyle={badgeStyle} $width={width}>
      {displayValue}
    </Badge>
  );
}

const Badge = styled.span`
  min-width: ${({ $width }) => $width};
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  ${({ $customStyle }) => $customStyle}
`;

const DropdownRoot = styled.div`
  position: relative;
  width: ${({ $width }) => $width};
`;

const TriggerButton = styled.button`
  width: 100%;
  height: 28px;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 0 30px 0 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: all 0.15s ease;
  ${({ $customStyle }) => $customStyle}

  &:disabled {
    opacity: 0.6;
  }
`;

const TriggerText = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
`;

const TriggerIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%)
    rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  display: flex;
  transition: transform 0.18s ease;
`;

const PortalMenu = styled.div`
  position: fixed;
  z-index: 9999;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: var(--shadow);
`;

const MenuItem = styled.button`
  position: relative;
  width: 100%;
  min-height: 34px;
  padding: 0 30px 0 10px;
  border: none;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? "#f8fafc" : "transparent")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ItemLeft = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ColorDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const ItemLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--placeholder);
`;

const SelectedIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--font);
  display: flex;
`;
