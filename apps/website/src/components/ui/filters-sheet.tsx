"use client";

import { FilterIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/util/cn";

interface Props extends ComponentProps<typeof SheetTrigger> {
  filterCount: number;
  headerExtra?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export function FiltersSheet({
  filterCount,
  headerExtra,
  children,
  contentClassName,
  className,
  ...props
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild {...props}>
        <Button size="lg" className={cn("xl:hidden", className)}>
          <FilterIcon /> Filters{" "}
          {!!filterCount && <Badge className="text-blue pointer-events-none">{filterCount}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className={cn("h-[85dvh]", contentClassName)}>
        <div className="flex items-center gap-x-4 p-4 pb-1">
          <SheetTitle>Filters</SheetTitle>
          {!!filterCount && <div className="text-muted-foreground">{filterCount} active</div>}
          {headerExtra}
        </div>
        <div className="overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
