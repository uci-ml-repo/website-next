"use client";

import type { ComponentProps } from "react";

import { DatasetSearchFilterDualSlider } from "@/components/dataset/search/filter/type/dataset-search-filter-dual-slider";
import type { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSearchFilterInstanceCount(
  props: ComponentProps<typeof DatasetSearchFilterItem>,
) {
  const { instanceCount, setInstanceCount } = useDatasetSearchFilters();

  const { data: max, isLoading } = trpc.dataset.stat.maxInstanceCount.useQuery(undefined, {
    trpc: { context: { skipBatch: true } },
  });

  return (
    <DatasetSearchFilterDualSlider
      {...props}
      badge={instanceCount && (instanceCount.min > 0 || instanceCount.max < (max ?? 0))}
      clearFilter={() => setInstanceCount(null)}
      max={max}
      sliderValues={[instanceCount?.min ?? 0, instanceCount?.max ?? max ?? 0]}
      onValueChange={(values) => setInstanceCount({ min: values[0], max: values[1] })}
      exponential={0.5}
      isLoading={isLoading}
    />
  );
}
