"use client";

import { DatasetFiltersAccordion } from "@/components/dataset/search/filter/dataset-filters-accordion";
import { DatasetFiltersClear } from "@/components/dataset/search/filter/dataset-filters-clear";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataset-search-filters";
import { FiltersSheet } from "@/components/ui/filters-sheet";

export function DatasetFiltersMobile() {
  const { filterCount } = useDatasetSearchFilters();

  return (
    <FiltersSheet filterCount={filterCount} headerExtra={<DatasetFiltersClear />}>
      <DatasetFiltersAccordion type="multiple" />
    </FiltersSheet>
  );
}
