// DatasetSubjectAreasFilter.tsx
import React from "react";

import DatasetFilterCheckboxItem from "@/components/datasets/DatasetFilterCheckboxItem";
import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useToggleFilter } from "@/components/hooks/use-toggle-filter";
import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";

export default function DatasetSubjectAreasFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { filters, toggle, isToggled, clear } = useToggleFilter<
    "subjectAreas",
    Enums.DatasetSubjectArea
  >("subjectAreas");

  const subjectAreas = enumToArray(Enums.DatasetSubjectArea);

  return (
    <DatasetFilterItem
      label="Subject Area"
      tooltipOpen={tooltipOpen}
      tooltipContent="The subject area of the dataset"
      active={!!filters.subjectAreas?.length}
      activeCount={filters.subjectAreas?.length}
      clearFilter={clear}
    >
      <div className="space-y-1">
        {subjectAreas.map((subjectArea, index) => (
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
