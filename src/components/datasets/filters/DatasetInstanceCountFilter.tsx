import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { trpc } from "@/server/trpc/query/client";

export function DatasetInstanceCountFilter(props: DatasetFiltersProps) {
  const { data } = trpc.dataset.stats.maxDataSize.useQuery();

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
