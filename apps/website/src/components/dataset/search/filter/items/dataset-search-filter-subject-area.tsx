"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import type { ComponentProps } from "react";

import { DatasetSearchFilterAccordionItem } from "@/components/dataset/search/filter/dataset-search-filter-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetSearchFilterSubjectArea(
  props: ComponentProps<typeof DatasetSearchFilterAccordionItem>,
) {
  const { filterSubjectArea, setFilterSubjectArea } = useDatasetSearchFilters();

  const addSubjectArea = (subjectArea: Enums.DatasetSubjectArea) => {
    setFilterSubjectArea((prev) => [...(prev ?? []), subjectArea]);
  };
  const removeSubjectArea = (subjectArea: Enums.DatasetSubjectArea) => {
    setFilterSubjectArea((prev) => prev?.filter((area) => area !== subjectArea) ?? []);
  };

  return (
    <DatasetSearchFilterAccordionItem
      {...props}
      badge={filterSubjectArea?.length}
      clearFilter={() => setFilterSubjectArea(null)}
    >
      {enumToArray(Enums.DatasetSubjectArea).map((subjectArea) => {
        const checked = filterSubjectArea?.includes(subjectArea);
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
    </DatasetSearchFilterAccordionItem>
  );
}
