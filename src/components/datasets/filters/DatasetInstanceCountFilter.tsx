import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { trpc } from "@/server/trpc/query/client";

export function DatasetInstanceCountFilter(props: DatasetFilterProps) {
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
      filterMinKey="instanceCountMin"
      filterMaxKey="instanceCountMax"
      maxRawValue={data?.maxInstanceCount}
      {...props}
    />
  );
}
