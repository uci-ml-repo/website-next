import { useSidebar } from "@components/layout/sidebar/sidebar-provider";
import type { ComponentProps } from "react";
import { forwardRef, useRef } from "react";

export const SidebarHoverExpandable = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ children, ...props }, ref) => {
    const { desktopState, setDesktopState } = useSidebar();

    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      if (!hoverTimerRef.current) {
        hoverTimerRef.current = setTimeout(
          () => {
            if (desktopState !== "expanded") {
              setDesktopState("hovered");
              hoverTimerRef.current = null;
            }
          },
          desktopState === "hovered" ? 0 : 150,
        );
      }
    };

    const handleMouseLeave = () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      if (desktopState === "hovered") {
        setDesktopState("collapsed");
      }
    };

    return (
      <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        {children}
      </div>
    );
  },
);

SidebarHoverExpandable.displayName = "SidebarHoverExpandable";
