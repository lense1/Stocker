import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const handleOffline = () => {
      clearHideTimer();
      setIsOnline(false);
      setVisible(true);
    };

    const handleOnline = () => {
      clearHideTimer();
      setIsOnline(true);
      setVisible(true);

      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 2000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      setIsOnline(false);
      setVisible(true);
    }

    return () => {
      clearHideTimer();
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!visible) return null;

  return (
    <Banner $online={isOnline}>
      {isOnline
        ? "네트워크가 다시 연결되었습니다."
        : "네트워크 연결이 끊어졌습니다. 인터넷 상태를 확인해주세요."}
    </Banner>
  );
}

const Banner = styled.div`
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  min-width: 320px;
  max-width: calc(100vw - 32px);
  padding: 12px 16px;
  border-radius: 14px;

  color: white;
  font-size: 14px;
  font-weight: 700;
  text-align: center;

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  background: ${({ $online }) => ($online ? "#16a34a" : "#dc2626")};
`;