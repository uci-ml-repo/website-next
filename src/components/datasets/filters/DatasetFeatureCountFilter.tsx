import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetFeatureCountFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Feature Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of features (columns of data)"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      clearFilter={() =>
        setFilters({
          featureCountMin: undefined,
          featureCountMax: undefined,
        })
      }
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
