"use client";

import { SidebarContent } from "@components/layout/sidebar/sidebar-content";
import { useSidebar } from "@components/layout/sidebar/sidebar-provider";
import type { Session } from "@lib/auth/auth";
import { cn } from "@lib/util/cn";
import React from "react";

import { SidebarMobileSheet } from "./sidebar-mobile-sheet";

export function Sidebar({ session }: { session: Session | null }) {
  const { view, desktopState } = useSidebar();
  return view === "mobile" ? (
    <SidebarMobileSheet>
      <SidebarContent initialSession={session} />
    </SidebarMobileSheet>
  ) : (
    <SidebarContent
      initialSession={session}
      className={cn(
        "max-md:hidden",
        "peer fixed top-0 bottom-0 left-0 z-50 transition-[shadow,width] duration-100 ease-out",
        "bg-sidebar text-foreground flex flex-col overflow-x-hidden overflow-y-hidden border-r",
        "data-[state=expanded]:max-xl:shadow-sidebar data-[state=hovered]:shadow-sidebar",
        "w-(--sidebar-width) data-[state=collapsed]:!w-(--sidebar-width-collapsed)",
      )}
      data-state={desktopState}
    />
  );
}
