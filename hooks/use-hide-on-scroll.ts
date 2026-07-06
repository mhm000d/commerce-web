"use client";

import { useState, useEffect, useRef } from "react";

interface UseHideOnScrollOptions {
  threshold?: number; // minimum scroll distance before hiding (default: 50)
  initialVisibility?: boolean;
}

export function useHideOnScroll({
  threshold = 80,
  initialVisibility = true,
}: UseHideOnScrollOptions = {}) {
  const [shouldShow, setShouldShow] = useState(initialVisibility);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      if (currentScrollY <= threshold) {
        setShouldShow(true);
      } else if (currentScrollY > previousScrollY + 12) {
        setShouldShow(false);
      } else if (currentScrollY < previousScrollY - 12) {
        setShouldShow(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    const onScroll = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return shouldShow;
}