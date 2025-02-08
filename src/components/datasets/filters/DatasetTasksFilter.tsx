import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetTasksFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Dataset Tasks"
      tooltipOpen={tooltipOpen}
      tooltipContent="The tasks that the dataset can be used for"
      clearFilter={() => setFilters({ tasks: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
