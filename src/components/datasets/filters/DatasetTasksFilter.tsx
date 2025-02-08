import React from "react";

import DatasetFilterCheckbox from "@/components/datasets/checkbox/DatasetFilterCheckbox";
import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export default function DatasetFeatureTypesFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "tasks",
    Enums.DatasetTask
  >("tasks");

  return (
    <DatasetFilterItem
      label="Dataset Tasks"
      tooltipOpen={tooltipOpen}
      tooltipContent="The tasks that the dataset can be used for"
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
    </DatasetFilterItem>
  );
}
