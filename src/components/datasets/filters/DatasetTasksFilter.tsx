import React from "react";

import { DatasetFilterCheckbox } from "@/components/datasets/checkbox/DatasetFilterCheckbox";
import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetTasksFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "tasks",
    Enums.DatasetTask
  >("tasks");

  return (
    <DatasetsFilterItem
      label="Dataset Tasks"
      tooltipOpen={tooltipOpen}
      tooltipContent="The tasks of the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.tasks?.length}
      activeCount={filters.tasks?.length}
      clearFilter={clear}
    >
      <DatasetFilterCheckbox
        values={enumToArray(Enums.DatasetTask)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetsFilterItem>
  );
}
