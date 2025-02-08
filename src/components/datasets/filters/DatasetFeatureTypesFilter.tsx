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
    "featureTypes",
    Enums.DatasetFeatureType
  >("featureTypes");

  return (
    <DatasetFilterItem
      label="Feature Types"
      tooltipContent="The data type of features in the dataset"
      tooltipOpen={tooltipOpen}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.featureTypes?.length}
      activeCount={filters.featureTypes?.length}
      clearFilter={clear}
    >
      <DatasetFilterCheckbox
        values={enumToArray(Enums.DatasetFeatureType)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetFilterItem>
  );
}
