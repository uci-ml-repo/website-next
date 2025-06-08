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

  if (typeof breakpoint === "string") {
    breakpoint = BREAKPOINTS[breakpoint];
  }

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsBreakpoint(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsBreakpoint(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isBreakpoint;
}
