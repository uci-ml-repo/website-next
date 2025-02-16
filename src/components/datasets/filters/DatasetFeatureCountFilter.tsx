import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFeatureCountFilter(props: DatasetFilterProps) {
  const { data } = trpc.dataset.stats.maxDataSize.useQuery(undefined, {
    trpc: {
      context: {
        skipBatch: true,
      },
    },
  });

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
