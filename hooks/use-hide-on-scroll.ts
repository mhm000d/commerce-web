"use client";

import { useState, useEffect } from "react";

interface UseHideOnScrollOptions {
  threshold?: number; // minimum scroll distance before hiding (default: 50)
  initialVisibility?: boolean;
}

export function useHideOnScroll({
                                  threshold = 50,
                                  initialVisibility = true,
                                }: UseHideOnScrollOptions = {}) {
  const [shouldShow, setShouldShow] = useState(initialVisibility);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < threshold) {
            // Near top – always show
            setShouldShow(true);
          } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
            // Scrolling down – hide
            setShouldShow(false);
          } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
            // Scrolling up – show
            setShouldShow(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, threshold]);

  return shouldShow;
}