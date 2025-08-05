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

  return (
    <DatasetSearchFilterAccordionItem
      {...props}
      badge={filterSubjectArea?.length}
      clearFilter={() => setFilterSubjectArea(null)}
    >
      <div className="space-y-1">
        {enumToArray(Enums.DatasetSubjectArea).map((subjectArea) => (
          <CheckboxLabeled
            key={subjectArea}
            className="py-1 first:pt-0 last:pb-0"
            onClick={() =>
              setFilterSubjectArea((prev) =>
                prev?.includes(subjectArea)
                  ? prev.filter((area) => area !== subjectArea)
                  : [...(prev ?? []), subjectArea],
              )
            }
            checked={filterSubjectArea?.includes(subjectArea)}
          >
            {formatEnum(subjectArea)}
          </CheckboxLabeled>
        ))}
      </div>
    </DatasetSearchFilterAccordionItem>
  );
}
