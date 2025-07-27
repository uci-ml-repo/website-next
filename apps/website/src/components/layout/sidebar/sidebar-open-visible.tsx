import { useSidebar } from "@components/layout/sidebar/sidebar-provider";
import { cn } from "@lib/util/cn";
import type { HTMLAttributes } from "react";

export function SidebarOpenVisible({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { mobileState, view, desktopState } = useSidebar();

  const isOpen =
    (view === "mobile" && mobileState !== "collapsed") ||
    (view !== "mobile" && desktopState !== "collapsed");

  return (
    isOpen && (
      <div className={cn("animate-in fade-in-0", className)} {...props}>
        {children}
      </div>
    )
  );
}
