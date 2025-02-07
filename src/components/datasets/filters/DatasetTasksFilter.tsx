import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetTasksFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Dataset Tasks"
      clearFilter={() => setFilters({ tasks: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
