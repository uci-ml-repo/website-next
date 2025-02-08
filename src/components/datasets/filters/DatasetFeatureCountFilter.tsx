import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetFeatureCountFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Feature Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of features (columns of data)"
      clearFilter={() =>
        setFilters({
          featureCountMin: undefined,
          featureCountMax: undefined,
        })
      }
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
