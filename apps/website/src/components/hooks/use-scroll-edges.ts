"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

type ScrollEdges = {
  atTop: boolean;
  atBottom: boolean;
  atLeft: boolean;
  atRight: boolean;
};

export function useScrollEdges<T extends HTMLElement>(margin: number = 0) {
  const ref = useRef<T | null>(null);

  const [edges, setEdges] = useState<ScrollEdges>({
    atTop: true,
    atBottom: false,
    atLeft: true,
    atRight: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkEdges = () => {
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;

      setEdges({
        atTop: scrollTop <= margin,
        atBottom: scrollTop + clientHeight >= scrollHeight - margin,
        atLeft: scrollLeft <= margin,
        atRight: scrollLeft + clientWidth >= scrollWidth - margin,
      });
    };

    el.addEventListener("scroll", checkEdges, { passive: true });
    checkEdges();

    return () => {
      el.removeEventListener("scroll", checkEdges);
    };
  }, [margin]);

  return { ref: ref as RefObject<T>, edges };
}
