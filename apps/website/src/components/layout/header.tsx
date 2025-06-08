"use client";

import { useHasScrolledX } from "@website/components/hooks/use-has-scrolled";
import { useSidebar } from "@website/components/layout/sidebar/sidebar-provider";
import { SidebarTrigger } from "@website/components/layout/sidebar/sidebar-trigger";
import { cn } from "@website/lib/utils/cn";

export function Header() {
  const { view } = useSidebar();
  const hasScrolled = useHasScrolledX();

  return (
    <header
      className={cn(
        "z-50 h-(--header-height) transition-shadow",
        "max-md:bg-background max-md:fixed max-md:top-0 max-md:right-0 max-md:left-0",
        {
          "max-md:shadow-md": hasScrolled,
        },
      )}
    >
      {view === "mobile" && <SidebarTrigger className="md:invisible" />}
    </header>
  );
}
