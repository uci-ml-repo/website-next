import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { ReactNode } from "react";

import { useSidebar } from "@/components/layout/sidebar/sidebar-provider";
import { Sidebar, SidebarContent, SidebarTitle } from "@/components/ui/sidebar";
import { cn } from "@/lib/util/cn";

export function SidebarMobileSheet({ children, ...props }: { children: ReactNode }) {
  const { mobileState, setMobileState } = useSidebar();

  return (
    <Sidebar
      open={mobileState === "expanded"}
      onOpenChange={() =>
        setMobileState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
      }
      {...props}
    >
      <SidebarContent
        aria-describedby={undefined}
        side="left"
        className={cn(
          "bg-sidebar text-sidebar-foreground max-w-[80svw] p-0 duration-150 ease-out",
          "shadow-sidebar w-(--sidebar-width)",
        )}
        closeButton={false}
      >
        <VisuallyHidden>
          <SidebarTitle>Sidebar</SidebarTitle>
        </VisuallyHidden>

        {children}
      </SidebarContent>
    </Sidebar>
  );
}
