import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useIsBreakpoint(MOBILE_BREAKPOINT);
}

export function useIsBreakpoint(breakpoint: number) {
  const [isBreakpoint, setIsBreakpoint] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
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
