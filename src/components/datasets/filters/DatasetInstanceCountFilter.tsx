import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetInstanceCountFilter(props: DatasetFilterProps) {
  const { filters } = useQueryFilters<DatasetQuery>();

  const { data } = trpc.dataset.stats.maxDataSize.useQuery(undefined, {
    trpc: {
      context: {
        skipBatch: true,
      },
    },
  });

  return (
    <DatasetFilterDualSlider
      label="Instance Count"
      tooltipContent="The number of instances (rows of data)"
      filterMin={filters.instanceCountMin}
      filterMax={filters.instanceCountMax}
      filterMinKey="instanceCountMin"
      filterMaxKey="instanceCountMax"
      maxRawValue={data?.maxInstanceCount}
      {...props}
    />
  );
}
