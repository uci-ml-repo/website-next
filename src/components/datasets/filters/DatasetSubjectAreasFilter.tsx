import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetSubjectAreasFilter() {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Subject Area"
      clearFilter={() => setFilters({ subjectAreas: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
