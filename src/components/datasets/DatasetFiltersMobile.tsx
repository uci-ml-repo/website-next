"use client";

import { FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  DatasetFilterContent,
  datasetFilters,
} from "@/components/datasets/DatasetFiltersContent";
import { useIsBreakpoint } from "@/components/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DatasetFiltersMobile() {
  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(datasetFilters.length).fill(false),
  );

  const [sheetOpen, setSheetOpen] = useState(false);

  const breakpoint = useIsBreakpoint(1024);

  useEffect(() => {
    if (!breakpoint) {
      setSheetOpen(false);
    }
  }, [breakpoint]);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="blue" className="lg:hidden" size="lg">
          <FilterIcon /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        forceMount
        side="bottom"
        className="max-h-[90svh] overflow-y-auto bg-card"
      >
        <SheetTitle>Filters</SheetTitle>

        <DatasetFilterContent
          openStates={openStates}
          setOpenStates={setOpenStates}
        />
      </SheetContent>
    </Sheet>
  );
}
