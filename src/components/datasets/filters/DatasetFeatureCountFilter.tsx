import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetFeatureCountFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Feature Count"
      clearFilter={() =>
        setFilters({ featureCountMin: undefined, featureCountMax: undefined })
      }
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
