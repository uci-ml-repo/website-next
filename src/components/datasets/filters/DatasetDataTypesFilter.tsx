import React from "react";

import DatasetFilterCheckboxItem from "@/components/datasets/DatasetFilterCheckboxItem";
import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export default function DatasetDataTypesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "dataTypes",
    Enums.DatasetDataType
  >("dataTypes");

  const dataTypes = enumToArray(Enums.DatasetDataType);

  return (
    <DatasetFilterItem
      label="Data Types"
      tooltipOpen={tooltipOpen}
      tooltipContent="The types of data in the dataset"
      active={!!filters.dataTypes?.length}
      activeCount={filters.dataTypes?.length}
      clearFilter={clear}
    >
      <div className="space-y-1">
        {dataTypes.map((dataType, index) => (
          <React.Fragment key={dataType}>
            {index > 0 && <hr />}
            <DatasetFilterCheckboxItem
              toggle={toggle}
              value={dataType}
              checked={isToggled(dataType)}
            />
          </React.Fragment>
        ))}
      </div>
    </DatasetFilterItem>
  );
}
