"use client";

import { Button } from "@components/ui/button";
import { cn } from "@lib/util/cn";
import { MenuIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

import { useSidebar } from "./sidebar-provider";

export const SidebarTrigger = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("m-2 size-12", className)}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        {...props}
      >
        <MenuIcon className="size-6" />
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";
