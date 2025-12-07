import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useIsBreakpoint(breakpoint: number | Breakpoint) {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean | undefined>(undefined);

  const numericBreakpoint = typeof breakpoint === "string" ? BREAKPOINTS[breakpoint] : breakpoint;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${numericBreakpoint - 1}px)`);

    const onChange = () => {
      setIsBreakpoint(window.innerWidth < numericBreakpoint);
    };

    mql.addEventListener("change", onChange);
    setIsBreakpoint(window.innerWidth < numericBreakpoint);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, [numericBreakpoint]);

  return !!isBreakpoint;
}
