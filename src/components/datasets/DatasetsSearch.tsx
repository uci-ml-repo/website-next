"use client";

import { FilterIcon } from "lucide-react";

import DatasetsSearchOrderBy from "@/components/datasets/DatasetsSearchOrderBy";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DatasetsSearch() {
  return (
    <div className="flex">
      <div className="w-80 max-md:hidden">Filters</div>
      <div className="flex w-full items-center justify-between">
        <div>Search</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="blue">
              <FilterIcon />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80dvh]">
            <SheetTitle>Filters</SheetTitle>
          </SheetContent>
        </Sheet>
        <DatasetsSearchOrderBy />
      </div>
    </div>
  );
}
