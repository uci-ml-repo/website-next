"use client";

import type { ComponentProps } from "react";

import type { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { DatasetFilterMultiselect } from "@/components/dataset/search/filter/type/dataset-filter-multiselect";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFilterFeatures(props: ComponentProps<typeof DatasetFilterItem>) {
  const { features, setFeatures } = useDatasetSearchFilters();

  const { data: remainingFilters, isLoading } = trpc.feature.find.remainingFilters.useQuery(
    { features },
    skipBatch,
  );

  return (
    <DatasetFilterMultiselect
      values={remainingFilters}
      selectedValues={features}
      setSelectedValues={setFeatures}
      placeholder="Search features"
      empty="No features found"
      isLoading={isLoading}
      {...props}
    />
  );
}
