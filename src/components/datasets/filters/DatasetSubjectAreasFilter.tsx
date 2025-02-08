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
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const subjectAreas = enumToArray(Enums.DatasetSubjectArea);

  function handleCheckedChange(
    checked: boolean,
    subjectArea: Enums.DatasetSubjectArea,
  ) {
    if (checked) {
      setFilters({
        subjectAreas: [...(filters.subjectAreas ?? []), subjectArea],
      });
    } else {
      const updated = (filters.subjectAreas || []).filter(
        (sa) => sa !== subjectArea,
      );
      setFilters({
        subjectAreas: updated.length > 0 ? updated : undefined,
      });
    }
  }

  return (
    <DatasetFilterItem
      label="Subject Area"
      tooltipOpen={tooltipOpen}
      tooltipContent="The subject area of the dataset"
      active={!!filters.subjectAreas?.length}
      activeCount={filters.subjectAreas?.length}
      clearFilter={() => setFilters({ subjectAreas: undefined })}
    >
      <div className="space-y-1.5">
        {subjectAreas.map((subjectArea, index) => (
          <React.Fragment key={subjectArea}>
            {index > 0 && <hr />}
            <div className="flex items-center justify-between">
              <div>{formatEnum(subjectArea)}</div>
              <Checkbox
                checked={filters.subjectAreas?.includes(subjectArea) || false}
                onCheckedChange={(checked) =>
                  handleCheckedChange(!!checked, subjectArea)
                }
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </DatasetFilterItem>
  );
}
