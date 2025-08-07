"use client";

import type { ComponentProps } from "react";

import { DatasetFilterDualSlider } from "@/components/dataset/search/filter/type/dataset-filter-dual-slider";
import type { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFilterFeatureCount(props: ComponentProps<typeof DatasetFilterItem>) {
  const { featureCount, setFeatureCount } = useDatasetSearchFilters();

  const { data: max, isLoading } = trpc.dataset.stat.maxFeatureCount.useQuery(undefined, skipBatch);

  return (
    <DatasetFilterDualSlider
      {...props}
      badge={featureCount && (featureCount.min > 0 || featureCount.max < (max ?? 0))}
      clearFilter={() => setFeatureCount(null)}
      max={max}
      sliderValues={[featureCount?.min ?? 0, featureCount?.max ?? max ?? 0]}
      onValueChange={(values) => setFeatureCount({ min: values[0], max: values[1] })}
      exponential={0.5}
      isLoading={isLoading}
    />
  );
}
