import React from "react";

import { DatasetCheckboxFilter } from "@/components/datasets/checkbox/DatasetCheckboxFilter";
import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export function DatasetFeatureTypesFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "featureTypes",
    Enums.DatasetFeatureType
  >("featureTypes");

  return (
    <DatasetsFilterItem
      label="Feature Types"
      tooltipContent="The data type of features in the dataset"
      tooltipOpen={tooltipOpen}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.featureTypes?.length}
      activeCount={filters.featureTypes?.length}
      clearFilter={clear}
    >
      <DatasetCheckboxFilter
        values={enumToArray(Enums.DatasetFeatureType)}
        toggle={toggle}
        isToggled={isToggled}
      />
    </DatasetsFilterItem>
  );
}
