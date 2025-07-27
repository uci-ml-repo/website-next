import { useSidebar } from "@components/layout/sidebar/sidebar-provider";
import { Sheet, SheetContent, SheetTitle } from "@components/ui/sheet";
import { cn } from "@lib/util/cn";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { ReactNode } from "react";

export function SidebarMobileSheet({ children, ...props }: { children: ReactNode }) {
  const { mobileState, setMobileState } = useSidebar();

  return (
    <Sheet
      open={mobileState === "expanded"}
      onOpenChange={() =>
        setMobileState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
      }
      {...props}
    >
      <SheetContent
        aria-describedby={undefined}
        side="left"
        className={cn(
          "bg-sidebar text-sidebar-foreground max-w-[80svw] p-0 duration-150 ease-out",
          "shadow-sidebar w-(--sidebar-width)",
        )}
        closeButton={false}
      >
        <VisuallyHidden>
          <SheetTitle>Sidebar</SheetTitle>
        </VisuallyHidden>

        {children}
      </SheetContent>
    </Sheet>
  );
}
