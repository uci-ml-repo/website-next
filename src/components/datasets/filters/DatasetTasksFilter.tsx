import React from "react";

import { DatasetCheckboxFilter } from "@/components/datasets/checkbox/DatasetCheckboxFilter";
import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetTasksFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "tasks",
    Enums.DatasetTask
  >("tasks");

  return (
    <DatasetFilterItem
      label="Dataset Tasks"
      tooltipOpen={tooltipOpen}
      tooltipContent="The tasks of the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.tasks?.length}
      activeCount={filters.tasks?.length}
      clearFilter={clear}
    >
      <DatasetCheckboxFilter
        values={enumToArray(Enums.DatasetTask)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetFilterItem>
  );
}
