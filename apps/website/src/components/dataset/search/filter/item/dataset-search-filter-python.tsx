"use client";

import type { ComponentProps } from "react";

import { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";

export function DatasetSearchFilterPython(props: ComponentProps<typeof DatasetSearchFilterItem>) {
  const { isAvailablePython, setIsAvailablePython } = useDatasetSearchFilters();

  return (
    <DatasetSearchFilterItem
      {...props}
      badge={isAvailablePython}
      clearFilter={() => setIsAvailablePython(null)}
    >
      <CheckboxLabeled
        checked={isAvailablePython === true}
        onCheckedChange={(checked) => setIsAvailablePython(checked === true || null)}
        role="button"
        aria-label={
          isAvailablePython ? "Disable Python import filter" : "Enable Python import filter"
        }
      >
        Available for Python import
      </CheckboxLabeled>
    </DatasetSearchFilterItem>
  );
}
