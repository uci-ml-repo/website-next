import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetKeywordsFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  // const { data, isLoading } = trpc.keyword.find.approved.useQuery();

  return (
    <DatasetFilterItem
      label="Keywords"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      tooltipOpen={tooltipOpen}
      tooltipContent="Keywords that describe the dataset"
      clearFilter={() => setFilters({ keywords: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
