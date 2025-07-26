"use client";

import { useIsBreakpoint } from "@components/hooks/use-is-breakpoint";
import { cn } from "@lib/utils/cn";
import type { ComponentProps, Dispatch, SetStateAction } from "react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SidebarDesktopState = "expanded" | "collapsed" | "hovered";
type SidebarMobileState = "expanded" | "collapsed";
type SidebarView = "desktop" | "desktop-xl" | "mobile";

type SidebarContext = {
  toggleSidebar: () => void;
  desktopState: SidebarDesktopState;
  mobileState: SidebarMobileState;
  setDesktopState: Dispatch<SetStateAction<SidebarDesktopState>>;
  setMobileState: Dispatch<SetStateAction<SidebarMobileState>>;
  currentState: SidebarDesktopState | SidebarMobileState;
  view: SidebarView | undefined;
};

const SidebarContext = createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export const SidebarProvider = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const isMobile = useIsBreakpoint("md");
    const isSmallDesktop = useIsBreakpoint("lg");

    const view = isMobile ? "mobile" : isSmallDesktop ? "desktop" : "desktop-xl";

    const [desktopState, setDesktopState] = useState<SidebarDesktopState>("collapsed");
    const [mobileState, setMobileState] = useState<SidebarMobileState>("collapsed");

    // If in mobile, collapse the desktop sidebar
    useEffect(() => {
      if (view === "mobile") {
        setDesktopState("collapsed");
      }
    }, [view, desktopState]);

    // If in desktop, collapse the mobile sidebar
    useEffect(() => {
      if (view !== "mobile") {
        setMobileState("collapsed");
      }
    }, [view, mobileState]);

    // When switching from desktop-xl to desktop-md, collapse the sidebar
    useEffect(() => {
      if (view !== "desktop-xl") {
        setDesktopState("collapsed");
      }
    }, [view]);

    const toggleSidebar = useCallback(() => {
      if (view === "mobile") {
        setMobileState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
      } else {
        setDesktopState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
      }
    }, [view]);

    const contextValue = useMemo<SidebarContext>(
      () => ({
        toggleSidebar,
        desktopState,
        mobileState,
        setDesktopState,
        setMobileState,
        currentState: view === "mobile" ? mobileState : desktopState,
        view,
      }),
      [toggleSidebar, desktopState, mobileState, view],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div className={cn("flex", className)} ref={ref} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";
