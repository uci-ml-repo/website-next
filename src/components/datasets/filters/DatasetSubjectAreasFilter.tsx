import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetSubjectAreasFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Subject Area"
      tooltipOpen={tooltipOpen}
      tooltipContent="The subject area of the dataset"
      clearFilter={() => setFilters({ subjectAreas: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
