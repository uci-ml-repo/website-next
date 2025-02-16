import React from "react";

import { DatasetCheckboxFilter } from "@/components/datasets/checkbox/DatasetCheckboxFilter";
import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetSubjectAreasFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "subjectAreas",
    Enums.DatasetSubjectArea
  >("subjectAreas");

  return (
    <DatasetFilterItem
      label="Subject Area"
      tooltipOpen={tooltipOpen}
      tooltipContent="The subject area of the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.subjectAreas?.length}
      activeCount={filters.subjectAreas?.length}
      clearFilter={clear}
    >
      <DatasetCheckboxFilter
        values={enumToArray(Enums.DatasetSubjectArea)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetFilterItem>
  );
}
