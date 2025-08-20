"use client";

import { FilterIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { DatasetFiltersAccordion } from "@/components/dataset/search/filter/dataset-filters-accordion";
import { DatasetFiltersClear } from "@/components/dataset/search/filter/dataset-filters-clear";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function DatasetFiltersMobile(props: ComponentProps<typeof SheetTrigger>) {
  const { filterCount } = useDatasetSearchFilters();

  return (
    <Sheet>
      <SheetTrigger asChild {...props}>
        <Button size="lg" className="xl:hidden">
          <FilterIcon /> Filters{" "}
          {!!filterCount && <Badge className="text-blue pointer-events-none">{filterCount}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90dvh]">
        <div className="flex items-center gap-x-4 p-4 pb-1">
          <SheetTitle>Filters</SheetTitle>
          {!!filterCount && <div className="text-muted-foreground">{filterCount} active</div>}
          <DatasetFiltersClear />
        </div>
        <div className="overflow-y-auto">
          <DatasetFiltersAccordion type="multiple" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
