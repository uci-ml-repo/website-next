import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetFeatureTypesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      tooltipOpen={tooltipOpen}
      tooltipContent="The data type of features in the dataset"
      label="Feature Types"
      clearFilter={() => setFilters({ featureTypes: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
