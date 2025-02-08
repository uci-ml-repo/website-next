import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetDataTypesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Data Types"
      tooltipOpen={tooltipOpen}
      tooltipContent="The types of data in the dataset"
      clearFilter={() => setFilters({ dataTypes: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
