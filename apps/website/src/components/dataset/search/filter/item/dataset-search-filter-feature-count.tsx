"use client";

import _ from "lodash";
import type { ComponentProps } from "react";

import { DatasetSearchFilterDualSlider } from "@/components/dataset/search/filter/type/dataset-search-filter-dual-slider";
import type { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSearchFilterFeatureCount(
  props: ComponentProps<typeof DatasetSearchFilterItem>,
) {
  const { featureCount, setFeatureCount } = useDatasetSearchFilters();

  const { data: max, isLoading } = trpc.dataset.stat.maxFeatureCount.useQuery(undefined, {
    trpc: { context: { skipBatch: true } },
  });

  return (
    <DatasetSearchFilterDualSlider
      {...props}
      badge={_.some(featureCount)}
      clearFilter={() => setFeatureCount(null)}
      max={max}
      sliderValues={[featureCount?.min ?? 0, featureCount?.max ?? max ?? 0]}
      onValueChange={(values) => setFeatureCount({ min: values[0], max: values[1] })}
      exponential={0.5}
      isLoading={isLoading}
    />
  );
}
