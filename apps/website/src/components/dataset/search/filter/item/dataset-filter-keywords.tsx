"use client";

import type { ComponentProps } from "react";

import type { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { DatasetFilterMultiselect } from "@/components/dataset/search/filter/type/dataset-filter-multiselect";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFilterKeywords(props: ComponentProps<typeof DatasetFilterItem>) {
  const { data: allKeywords, isLoading } = trpc.keyword.find.approved.useQuery(
    undefined,
    skipBatch,
  );

  const { keywords, setKeywords } = useDatasetSearchFilters();

  return (
    <DatasetFilterMultiselect
      values={allKeywords}
      selectedValues={keywords}
      setSelectedValues={setKeywords}
      placeholder="Search keywords"
      isLoading={isLoading}
      {...props}
    />
  );
}
