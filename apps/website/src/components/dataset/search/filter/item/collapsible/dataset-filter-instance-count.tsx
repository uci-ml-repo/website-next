"use client";

import type { ComponentProps } from "react";

import { DatasetFilterDualSlider } from "@/components/dataset/search/filter/type/dataset-filter-dual-slider";
import type { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFilterInstanceCount(props: ComponentProps<typeof DatasetFilterItem>) {
  const { instanceCount, setInstanceCount } = useDatasetSearchFilters();

  const { data: max, isLoading } = trpc.dataset.stat.maxInstanceCount.useQuery(
    undefined,
    skipBatch,
  );

  return (
    <DatasetFilterDualSlider
      {...props}
      badge={
        instanceCount &&
        ((instanceCount.min && instanceCount.min > 0) ||
          (instanceCount.max && instanceCount.max < (max ?? 0)))
      }
      clearFilter={() => setInstanceCount(null)}
      max={max}
      sliderValues={[instanceCount?.min ?? 0, instanceCount?.max ?? max ?? 0]}
      onValueChange={(values) => setInstanceCount({ min: values[0], max: values[1] })}
      exponential={0.5}
      isLoading={isLoading}
    />
  );
}
