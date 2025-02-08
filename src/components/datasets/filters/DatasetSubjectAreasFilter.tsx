import React from "react";

import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Checkbox } from "@/components/ui/checkbox";
import { Enums } from "@/db/enums";
import { enumToArray, formatEnum } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetSubjectAreasFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  // setFilters({ subjectAreas: [...] });

  const subjectAreas = Enums.DatasetSubjectArea;

  return (
    <DatasetFilterItem
      label="Subject Area"
      tooltipOpen={tooltipOpen}
      tooltipContent="The subject area of the dataset"
      clearFilter={() => setFilters({ subjectAreas: undefined })}
    >
      <div className="space-y-1.5">
        {enumToArray(subjectAreas).map((subjectArea, index) => (
          <React.Fragment key={subjectArea}>
            {index > 0 && <hr />}
            <div className="flex items-center justify-between">
              <div>{formatEnum(subjectArea)}</div>
              <Checkbox />
            </div>
          </React.Fragment>
        ))}
      </div>
    </DatasetFilterItem>
  );
}
