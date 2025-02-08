import React from "react";

import DatasetFilterCheckboxItem from "@/components/datasets/DatasetFilterCheckboxItem";
import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export default function DatasetFeatureTypesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "featureTypes",
    Enums.DatasetFeatureType
  >("featureTypes");

  const featureTypes = enumToArray(Enums.DatasetFeatureType);

  return (
    <DatasetFilterItem
      label="Feature Types"
      tooltipContent="The data type of features in the dataset"
      tooltipOpen={tooltipOpen}
      active={!!filters.featureTypes?.length}
      activeCount={filters.featureTypes?.length}
      clearFilter={clear}
    >
      <div className="space-y-1">
        {featureTypes.map((subjectArea, index) => (
          <React.Fragment key={subjectArea}>
            {index > 0 && <hr />}
            <DatasetFilterCheckboxItem
              toggle={toggle}
              value={subjectArea}
              checked={isToggled(subjectArea)}
            />
          </React.Fragment>
        ))}
      </div>
    </DatasetFilterItem>
  );
}
