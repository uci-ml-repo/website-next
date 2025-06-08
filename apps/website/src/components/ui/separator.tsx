"use client";

import { Root } from "@radix-ui/react-separator";
import { cn } from "@website/lib/utils/cn";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

const Separator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <Root
      ref={ref}
      decorative={decorative}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

export { Separator };
