import React from "react";

import { DatasetFilterCheckbox } from "@/components/datasets/checkbox/DatasetFilterCheckbox";
import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetDataTypesFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "dataTypes",
    Enums.DatasetDataType
  >("dataTypes");

  return (
    <DatasetsFilterItem
      label="Data Types"
      tooltipOpen={tooltipOpen}
      tooltipContent="The types of data in the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.dataTypes?.length}
      activeCount={filters.dataTypes?.length}
      clearFilter={clear}
    >
      <DatasetFilterCheckbox
        values={enumToArray(Enums.DatasetDataType)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetsFilterItem>
  );
}
