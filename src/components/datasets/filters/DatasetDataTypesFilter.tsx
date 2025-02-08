import React from "react";

import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Checkbox } from "@/components/ui/checkbox";
import { Enums } from "@/db/enums";
import { enumToArray, formatEnum } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetDataTypesFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const dataTypes = enumToArray(Enums.DatasetDataType);

  function handleCheckedChange(
    checked: boolean,
    datatType: Enums.DatasetDataType,
  ) {
    if (checked) {
      setFilters({
        dataTypes: [...(filters.dataTypes ?? []), datatType],
      });
    } else {
      const updated = (filters.dataTypes || []).filter(
        (sa) => sa !== datatType,
      );
      setFilters({
        dataTypes: updated.length > 0 ? updated : undefined,
      });
    }
  }

  return (
    <DatasetFilterItem
      label="Data Types"
      tooltipOpen={tooltipOpen}
      tooltipContent="The types of data in the dataset"
      active={!!filters.dataTypes?.length}
      activeCount={filters.dataTypes?.length}
      clearFilter={() => setFilters({ dataTypes: undefined })}
    >
      <div className="space-y-1.5">
        {dataTypes.map((dataType, index) => (
          <React.Fragment key={dataType}>
            {index > 0 && <hr />}
            <div className="flex items-center justify-between">
              <div>{formatEnum(dataType)}</div>
              <Checkbox
                checked={filters.dataTypes?.includes(dataType) || false}
                onCheckedChange={(checked) =>
                  handleCheckedChange(!!checked, dataType)
                }
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </DatasetFilterItem>
  );
}
