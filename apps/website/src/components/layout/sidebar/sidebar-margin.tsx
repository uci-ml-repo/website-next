import { cn } from "@website//lib/utils/cn";
import type { HTMLAttributes } from "react";

export function SidebarMargin({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full md:ml-(--sidebar-width-collapsed) peer-data-[state=expanded]:xl:!ml-(--sidebar-width)",
        "transition-margin duration-100 ease-out",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
