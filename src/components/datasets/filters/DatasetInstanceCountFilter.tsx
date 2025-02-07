import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetInstanceCountFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Instance Count"
      clearFilter={() =>
        setFilters({ instanceCountMin: undefined, instanceCountMax: undefined })
      }
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
