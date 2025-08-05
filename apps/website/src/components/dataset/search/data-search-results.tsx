"use client";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { trpc } from "@/server/trpc/query/client";
import type { DatasetQueryInput } from "@/server/types/dataset/request";

import { DatasetSearchFilterTitle } from "./filter/items/dataset-search-filter-title";

export function DataSearchResults() {
  const { filterPython, filterSubjectArea, filterTitle } = useDatasetSearchFilters();

  const query: DatasetQueryInput = {
    search: filterTitle,
    isAvailablePython: filterPython,
    subjectAreas: filterSubjectArea,
  };

  const { data } = trpc.dataset.find.byQuery.useQuery(query, {
    placeholderData: (prev) => prev,
  });

  const datasets = data?.datasets;
  const count = data?.count;

  return (
    <div className="w-full">
      <DatasetSearchFilterTitle />
      <div>{JSON.stringify(query)}</div>
      <div>{JSON.stringify(datasets?.map((d) => d.title))}</div>
      <div>{JSON.stringify(count)}</div>
    </div>
  );
}
