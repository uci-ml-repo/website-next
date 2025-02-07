import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetAttributesFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Attributes"
      clearFilter={() => setFilters({ attributes: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
