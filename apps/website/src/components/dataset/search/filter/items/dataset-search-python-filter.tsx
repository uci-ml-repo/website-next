"use client";

import type { ComponentProps } from "react";

import { DatasetSearchFiltersAccordionItem } from "@/components/dataset/search/filter/dataset-search-filters-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Checkbox } from "@/components/ui/checkbox";

export function DatasetSearchPythonFilter(
  props: ComponentProps<typeof DatasetSearchFiltersAccordionItem>,
) {
  const { filterPython, setFilterPython } = useDatasetSearchFilters();

  return (
    <DatasetSearchFiltersAccordionItem
      {...props}
      badge={filterPython}
      clearFilter={() => setFilterPython(null)}
    >
      <div
        className="flex w-fit cursor-pointer items-center space-x-2"
        onClick={() => setFilterPython((prev) => (prev ? null : true))}
      >
        <Checkbox checked={filterPython === true} />
        <div>Filter by python availability</div>
      </div>
    </DatasetSearchFiltersAccordionItem>
  );
}
