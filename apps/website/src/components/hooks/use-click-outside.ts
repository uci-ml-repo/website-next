"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

export function useClickOutside(ref: RefObject<HTMLElement | undefined>, callback: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (ref && ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
}
