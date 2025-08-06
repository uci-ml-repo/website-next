"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import type { ComponentProps } from "react";

import { DatasetSearchFilterAccordionItem } from "@/components/dataset/search/filter/dataset-search-filter-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetSearchFilterFeatureType(
  props: ComponentProps<typeof DatasetSearchFilterAccordionItem>,
) {
  const { featureTypes, setFeatureTypes } = useDatasetSearchFilters();

  const addFeatureType = (featureType: Enums.DatasetFeatureType) => {
    setFeatureTypes((prev) => [...(prev ?? []), featureType]);
  };
  const removeFeatureType = (featureType: Enums.DatasetFeatureType) => {
    setFeatureTypes((prev) => prev?.filter((area) => area !== featureType) ?? []);
  };

  return (
    <DatasetSearchFilterAccordionItem
      {...props}
      badge={featureTypes?.length}
      clearFilter={() => setFeatureTypes(null)}
    >
      {enumToArray(Enums.DatasetFeatureType).map((featureType) => {
        const checked = !!featureTypes?.includes(featureType);
        const enumString = formatEnum(featureType);

        return (
          <CheckboxLabeled
            key={featureType}
            className="py-1.5 first:pt-0 last:pb-0"
            checked={checked}
            onCheckedChange={(checked) =>
              checked ? addFeatureType(featureType) : removeFeatureType(featureType)
            }
            role="button"
            aria-label={`${checked ? "Disable" : "Enable"} ${enumString} feature type filter`}
          >
            {enumString}
          </CheckboxLabeled>
        );
      })}
    </DatasetSearchFilterAccordionItem>
  );
}
