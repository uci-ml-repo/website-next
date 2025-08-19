"use client";

import { FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function DatasetFiltersMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="xl:hidden">
          <FilterIcon /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Filters</SheetTitle>
      </SheetContent>
    </Sheet>
  );
}
