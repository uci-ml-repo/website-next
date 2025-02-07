import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetCharacteristicsFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Data Types"
      clearFilter={() => setFilters({ characteristics: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
