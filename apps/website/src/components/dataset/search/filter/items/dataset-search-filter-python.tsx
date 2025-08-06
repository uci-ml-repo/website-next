"use client";

import type { ComponentProps } from "react";

import { DatasetSearchFilterAccordionItem } from "@/components/dataset/search/filter/dataset-search-filter-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";

export function DatasetSearchFilterPython(
  props: ComponentProps<typeof DatasetSearchFilterAccordionItem>,
) {
  const { isAvailablePython, setIsAvailablePython } = useDatasetSearchFilters();

  return (
    <DatasetSearchFilterAccordionItem
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
    </DatasetSearchFilterAccordionItem>
  );
}
