import React from "react";

import { DatasetCheckboxFilter } from "@/components/datasets/checkbox/DatasetCheckboxFilter";
import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetDataTypesFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<"dataTypes", Enums.DatasetDataType>(
    "dataTypes",
  );

  return (
    <DatasetFilterItem
      label="Data Types"
      tooltipOpen={tooltipOpen}
      tooltipContent="The types of data in the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.dataTypes?.length}
      activeCount={filters.dataTypes?.length}
      clearFilter={clear}
    >
      <DatasetCheckboxFilter
        values={enumToArray(Enums.DatasetDataType)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetFilterItem>
  );
}
