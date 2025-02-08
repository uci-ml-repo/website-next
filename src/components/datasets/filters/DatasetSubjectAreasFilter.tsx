// DatasetSubjectAreasFilter.tsx
import React from "react";

import DatasetFilterCheckbox from "@/components/datasets/checkbox/DatasetFilterCheckbox";
import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export default function DatasetSubjectAreasFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
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
      <DatasetFilterCheckbox
        values={enumToArray(Enums.DatasetSubjectArea)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetFilterItem>
  );
}
