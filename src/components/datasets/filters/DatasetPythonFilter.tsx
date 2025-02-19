import { DatasetCheckboxFilterItem } from "@/components/datasets/checkbox/DatasetCheckboxFilterItem";
import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export function DatasetPythonFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Python Available"
      tooltipOpen={tooltipOpen}
      tooltipContent="Whether the dataset is available for import in Python"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={filters.python}
      clearFilter={() => setFilters({ python: undefined })}
    >
      <DatasetCheckboxFilterItem
        toggle={(checked) => setFilters({ python: checked, cursor: undefined })}
        value="Available for Python import"
        checked={!!filters.python}
      />
    </DatasetFilterItem>
  );
}
