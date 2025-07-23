"use client";

import { useHasScrolledX } from "@website/components/hooks/use-has-scrolled";
import { BackgroundGraphic } from "@website/components/layout/background/background-graphic";
import { useSidebar } from "@website/components/layout/sidebar/sidebar-provider";
import { SidebarTrigger } from "@website/components/layout/sidebar/sidebar-trigger";
import { cn } from "@website/lib/utils/cn";
import React from "react";

export function Header() {
  const { view } = useSidebar();
  const hasScrolled = useHasScrolledX();

  return (
    <header
      className={cn(
        "z-50 h-(--header-height) overflow-y-hidden transition-shadow",
        "max-md:bg-background max-md:fixed max-md:top-0 max-md:right-0 max-md:left-0",
        { "max-md:shadow-md": hasScrolled },
      )}
    >
      {view === "mobile" && <SidebarTrigger />}

      <BackgroundGraphic className="absolute top-0 right-0 -z-10 md:hidden" />
    </header>
  );
}
