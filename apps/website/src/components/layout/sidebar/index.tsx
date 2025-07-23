"use client";

import { SidebarContent } from "@components/layout/sidebar/sidebar-content";
import { useSidebar } from "@components/layout/sidebar/sidebar-provider";
import { cn } from "@website/lib/utils/cn";
import React from "react";

import { SidebarMobileSheet } from "./sidebar-mobile-sheet";

export function Sidebar() {
  const { view } = useSidebar();
  return view === "mobile" ? <SidebarMobile /> : <SidebarDesktop />;
}

function SidebarMobile() {
  return (
    <SidebarMobileSheet>
      <SidebarContent />
    </SidebarMobileSheet>
  );
}

function SidebarDesktop() {
  const { desktopState, mobileState, view } = useSidebar();

  return (
    <SidebarContent
      className={cn(
        "max-md:hidden",
        "peer fixed top-0 bottom-0 left-0 z-50 transition-[shadow,width] duration-100 ease-out",
        "bg-sidebar text-foreground flex flex-col overflow-x-hidden overflow-y-hidden border-r",
        "data-[state=expanded]:max-xl:shadow-sidebar data-[state=hovered]:shadow-sidebar",
        "w-(--sidebar-width) data-[state=collapsed]:!w-(--sidebar-width-collapsed)",
      )}
      data-state={view === "mobile" ? mobileState : desktopState}
    />
  );
}
