import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetFilterDualSlider } from "@/components/datasets/slider/DatasetFilterDualSlider";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFeatureCountFilter(props: DatasetFilterProps) {
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
      label="Feature Count"
      tooltipContent="The number of features (columns of data)"
      filterMin={filters.featureCountMin}
      filterMax={filters.featureCountMax}
      filterMaxKey="featureCountMax"
      filterMinKey="featureCountMin"
      maxRawValue={data?.maxFeatureCount}
      {...props}
    />
  );
}
