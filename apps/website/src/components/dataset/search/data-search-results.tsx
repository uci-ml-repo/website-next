"use client";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { trpc } from "@/server/trpc/query/client";

import { DatasetSearchFilterTitle } from "./filter/item/dataset-search-filter-title";

export function DataSearchResults() {
  const query = useDatasetSearchFilters();

  const { data } = trpc.dataset.find.byQuery.useQuery(
    {
      ...query,
      search: query.debouncedSearch,
      featureCount: query.debouncedFeatureCount,
      instanceCount: query.debouncedInstanceCount,
    },
    {
      placeholderData: (prev) => prev,
    },
  );

  const datasets = data?.datasets;
  const count = data?.count;

  return (
    <div className="w-full">
      <h1 className="h-10 text-2xl font-bold">Browse datasets</h1>

      <DatasetSearchFilterTitle />
      <div>{JSON.stringify(query)}</div>
      <div>{JSON.stringify(datasets?.map((d) => d.title))}</div>
      <div>{JSON.stringify(count)}</div>
    </div>
  );
}
