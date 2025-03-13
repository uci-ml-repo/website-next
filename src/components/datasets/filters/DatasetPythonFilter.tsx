import { useCallback } from "react";

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

  const clearFilter = useCallback(
    () => setFilters({ python: undefined }),
    [setFilters],
  );

  const setFilter = useCallback(
    (checked: boolean) => setFilters({ python: checked, cursor: undefined }),
    [setFilters],
  );

  return (
    <DatasetFilterItem
      label="Python Available"
      tooltipOpen={tooltipOpen}
      tooltipContent="Whether the dataset is available for import in Python"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={filters.python}
      clearFilter={clearFilter}
    >
      <DatasetCheckboxFilterItem
        toggle={setFilter}
        value="Available for Python import"
        formatText={false}
        checked={!!filters.python}
      />
    </DatasetFilterItem>
  );
}
