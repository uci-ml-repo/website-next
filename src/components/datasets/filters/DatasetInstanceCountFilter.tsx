import { useState } from "react";

import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetInstanceCountFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const [values, setValues] = useState([0, 100]);

  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Instance Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of instances (rows of data)"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      clearFilter={() =>
        setFilters({
          instanceCountMin: undefined,
          instanceCountMax: undefined,
        })
      }
    >
      <DualRangeSlider
        label={(value) => value}
        value={values}
        onValueChange={setValues}
        step={1}
        min={0}
        max={100}
      />
    </DatasetFilterItem>
  );
}
