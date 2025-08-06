"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import type { ComponentProps } from "react";

import { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetSearchFilterSubjectArea(
  props: ComponentProps<typeof DatasetSearchFilterItem>,
) {
  const { subjectAreas, setSubjectAreas } = useDatasetSearchFilters();

  const addSubjectArea = (subjectArea: Enums.DatasetSubjectArea) => {
    setSubjectAreas((prev) => [...(prev ?? []), subjectArea]);
  };
  const removeSubjectArea = (subjectArea: Enums.DatasetSubjectArea) => {
    setSubjectAreas((prev) => prev?.filter((area) => area !== subjectArea) ?? []);
  };

  return (
    <DatasetSearchFilterItem
      {...props}
      badge={subjectAreas?.length}
      clearFilter={() => setSubjectAreas(null)}
    >
      {enumToArray(Enums.DatasetSubjectArea).map((subjectArea) => {
        const checked = !!subjectAreas?.includes(subjectArea);
        const enumString = formatEnum(subjectArea);

        return (
          <CheckboxLabeled
            key={subjectArea}
            className="py-1.5 first:pt-0 last:pb-0"
            checked={checked}
            onCheckedChange={(checked) =>
              checked ? addSubjectArea(subjectArea) : removeSubjectArea(subjectArea)
            }
            role="button"
            aria-label={`${checked ? "Disable" : "Enable"} ${enumString} subject area filter`}
          >
            {enumString}
          </CheckboxLabeled>
        );
      })}
    </DatasetSearchFilterItem>
  );
}
