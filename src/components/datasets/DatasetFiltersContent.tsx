import React from "react";

import { DatasetAttributesFilter } from "@/components/datasets/filters/DatasetAttributesFilter";
import { DatasetDataTypesFilter } from "@/components/datasets/filters/DatasetDataTypesFilter";
import { DatasetFeatureCountFilter } from "@/components/datasets/filters/DatasetFeatureCountFilter";
import { DatasetFeatureTypesFilter } from "@/components/datasets/filters/DatasetFeatureTypesFilter";
import { DatasetInstanceCountFilter } from "@/components/datasets/filters/DatasetInstanceCountFilter";
import { DatasetKeywordsFilter } from "@/components/datasets/filters/DatasetKeywordsFilter";
import { DatasetPythonFilter } from "@/components/datasets/filters/DatasetPythonFilter";
import { DatasetSubjectAreasFilter } from "@/components/datasets/filters/DatasetSubjectAreasFilter";
import { DatasetTasksFilter } from "@/components/datasets/filters/DatasetTasksFilter";
import { Separator } from "@/components/ui/separator";

export interface DatasetFilterProps {
  tooltipOpen?: boolean;
  dropdownOpen?: boolean;
  onDropdownOpenChange?: () => void;
}

export const datasetFilters: React.FC<DatasetFilterProps>[] = [
  DatasetAttributesFilter,
  DatasetKeywordsFilter,
  DatasetDataTypesFilter,
  DatasetSubjectAreasFilter,
  DatasetTasksFilter,
  DatasetFeatureTypesFilter,
  DatasetFeatureCountFilter,
  DatasetInstanceCountFilter,
  DatasetPythonFilter,
];

export function DatasetFilterContent({
  tooltipsOpen,
  openStates,
  setOpenStates,
}: {
  tooltipsOpen?: boolean;
  openStates: boolean[];
  setOpenStates: React.Dispatch<React.SetStateAction<boolean[]>>;
}) {
  return (
    <div>
      {datasetFilters.map((Filter, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Separator />}
          <Filter
            tooltipOpen={tooltipsOpen}
            dropdownOpen={openStates?.[index]}
            onDropdownOpenChange={() =>
              setOpenStates?.((prev) =>
                prev.map((state, i) => (i === index ? !state : state)),
              )
            }
          />
        </React.Fragment>
      ))}
    </div>
  );
}
