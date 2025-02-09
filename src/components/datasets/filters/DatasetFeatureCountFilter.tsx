import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFeatureCountFilter(props: DatasetFiltersProps) {
  const { data } = trpc.dataset.stats.maxDataSize.useQuery();

  return (
    <DatasetFilterDualSlider
      label="Feature Count"
      tooltipContent="The number of features (columns of data)"
      filterMinKey="featureCountMin"
      filterMaxKey="featureCountMax"
      maxRawValue={data?.maxFeatureCount}
      {...props}
    />
  );
}
