import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetAttributesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Attributes"
      tooltipContent="The attributes (column variables) of the dataset"
      tooltipOpen={tooltipOpen}
      clearFilter={() => setFilters({ attributes: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
