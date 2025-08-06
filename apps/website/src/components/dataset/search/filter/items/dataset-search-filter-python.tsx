"use client";

import type { ComponentProps } from "react";

import { DatasetSearchFilterAccordionItem } from "@/components/dataset/search/filter/dataset-search-filter-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";

export function DatasetSearchFilterPython(
  props: ComponentProps<typeof DatasetSearchFilterAccordionItem>,
) {
  const { filterPython, setFilterPython } = useDatasetSearchFilters();

  return (
    <DatasetSearchFilterAccordionItem
      {...props}
      badge={filterPython}
      clearFilter={() => setFilterPython(null)}
    >
      <CheckboxLabeled
        checked={filterPython === true}
        onCheckedChange={(checked) => setFilterPython(checked === true || null)}
        role="button"
        aria-label={filterPython ? "Disable Python import filter" : "Enable Python import filter"}
      >
        Available for Python import
      </CheckboxLabeled>
    </DatasetSearchFilterAccordionItem>
  );
}
