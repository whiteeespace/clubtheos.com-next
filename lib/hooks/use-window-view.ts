"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

interface WindowView {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTabletOrMobile: boolean;
  width: number;
  height: number;
}

export function useWindowView(): WindowView {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < MOBILE_BREAKPOINT;
  const isTablet = windowSize.width >= MOBILE_BREAKPOINT && windowSize.width < TABLET_BREAKPOINT;
  const isDesktop = windowSize.width >= TABLET_BREAKPOINT;
  const isTabletOrMobile = windowSize.width < TABLET_BREAKPOINT;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTabletOrMobile,
    width: windowSize.width,
    height: windowSize.height,
  };
}

