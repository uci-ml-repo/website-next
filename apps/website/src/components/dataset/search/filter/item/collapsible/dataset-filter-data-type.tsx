"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import { without } from "lodash";
import type { ComponentProps } from "react";

import { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetFilterDataType(props: ComponentProps<typeof DatasetFilterItem>) {
  const { dataTypes, setDataTypes } = useDatasetSearchFilters();

  const addDataType = (dataType: Enums.DatasetDataType) =>
    setDataTypes((prev) => [...(prev ?? []), dataType]);

  const removeDataType = (dataType: Enums.DatasetDataType) =>
    setDataTypes((prev) => (prev ? without(prev, dataType) : []));

  return (
    <DatasetFilterItem {...props} badge={dataTypes?.length} clearFilter={() => setDataTypes(null)}>
      <ul>
        {enumToArray(Enums.DatasetDataType).map((dataType) => {
          const checked = !!dataTypes?.includes(dataType);
          const enumString = formatEnum(dataType);

          return (
            <li key={dataType} className="py-1 first:pt-0 last:pb-0">
              <CheckboxLabeled
                checked={checked}
                onCheckedChange={(checked) =>
                  checked ? addDataType(dataType) : removeDataType(dataType)
                }
                role="button"
                aria-label={`${checked ? "Disable" : "Enable"} ${enumString} data type filter`}
              >
                {enumString}
              </CheckboxLabeled>
            </li>
          );
        })}
      </ul>
    </DatasetFilterItem>
  );
}
