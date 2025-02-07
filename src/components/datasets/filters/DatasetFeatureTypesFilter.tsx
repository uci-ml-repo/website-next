import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetFeatureTypesFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Feature Types"
      clearFilter={() => setFilters({ featureTypes: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
