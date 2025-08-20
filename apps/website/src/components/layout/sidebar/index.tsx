"use client";

import { useClickOutside } from "@mantine/hooks";
import type { Session } from "@packages/auth/auth";

import { SidebarContent } from "@/components/layout/sidebar/sidebar-content";
import { useSidebar } from "@/components/layout/sidebar/sidebar-provider";
import { cn } from "@/lib/util/cn";

import { SidebarMobileSheet } from "./sidebar-mobile-sheet";

export function Sidebar({ session }: { session: Session | null }) {
  const { view, desktopState, setDesktopState } = useSidebar();

  const ref = useClickOutside(() => {
    if (desktopState === "expanded" && view === "desktop") {
      setDesktopState("collapsed");
    }
  });

  return view === "mobile" ? (
    <SidebarMobileSheet>
      <SidebarContent session={session} />
    </SidebarMobileSheet>
  ) : (
    <SidebarContent
      ref={ref}
      session={session}
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
