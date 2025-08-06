"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import type { ComponentProps } from "react";

import { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetSearchFilterDataType(props: ComponentProps<typeof DatasetSearchFilterItem>) {
  const { dataTypes, setDataTypes } = useDatasetSearchFilters();

  const addDataType = (dataType: Enums.DatasetDataType) => {
    setDataTypes((prev) => [...(prev ?? []), dataType]);
  };
  const removeDataType = (dataType: Enums.DatasetDataType) => {
    setDataTypes((prev) => prev?.filter((area) => area !== dataType) ?? []);
  };

  return (
    <DatasetSearchFilterItem
      {...props}
      badge={dataTypes?.length}
      clearFilter={() => setDataTypes(null)}
    >
      {enumToArray(Enums.DatasetDataType).map((dataType) => {
        const checked = !!dataTypes?.includes(dataType);
        const enumString = formatEnum(dataType);

        return (
          <CheckboxLabeled
            key={dataType}
            className="py-1.5 first:pt-0 last:pb-0"
            checked={checked}
            onCheckedChange={(checked) =>
              checked ? addDataType(dataType) : removeDataType(dataType)
            }
            role="button"
            aria-label={`${checked ? "Disable" : "Enable"} ${enumString} data type filter`}
          >
            {enumString}
          </CheckboxLabeled>
        );
      })}
    </DatasetSearchFilterItem>
  );
}
