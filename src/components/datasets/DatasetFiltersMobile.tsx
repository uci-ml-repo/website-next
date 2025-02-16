"use client";

import { FilterIcon } from "lucide-react";
import React, { useState } from "react";

import {
  DatasetFilterContent,
  datasetFilters,
} from "@/components/datasets/DatasetFiltersContent";
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

  // const isAnyOpen = openStates.some((state) => state);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" variant="blue" className="xl:hidden">
          <FilterIcon /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90svh] overflow-y-auto">
        <SheetTitle>Filters</SheetTitle>

        <DatasetFilterContent
          openStates={openStates}
          setOpenStates={setOpenStates}
        />
      </SheetContent>
    </Sheet>
  );
}
