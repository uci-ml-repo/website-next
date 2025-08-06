import type { ComponentProps } from "react";

import { DatasetSearchFilterDataType } from "@/components/dataset/search/filter/items/dataset-search-filter-data-type";
import { DatasetSearchFilterFeatureType } from "@/components/dataset/search/filter/items/dataset-search-filter-feature-type";
import { DatasetSearchFilterPython } from "@/components/dataset/search/filter/items/dataset-search-filter-python";
import { DatasetSearchFilterSubjectArea } from "@/components/dataset/search/filter/items/dataset-search-filter-subject-area";
import { DatasetSearchFilterTask } from "@/components/dataset/search/filter/items/dataset-search-filter-task";
import { DatasetSearchFilter } from "@/components/hooks/use-dataet-search-filters";
import { Accordion } from "@/components/ui/accordion";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

export function DatasetSearchFiltersAccordion({ tooltipsOpen, ...props }: Props) {
  return (
    <Accordion {...props}>
      <DatasetSearchFilterPython
        name="Python Availability"
        value={DatasetSearchFilter.Python}
        tooltip="Whether the dataset is available for import in Python"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterTask
        name="Tasks"
        value={DatasetSearchFilter.Task}
        tooltip="The tasks that the dataset is suitable for"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterSubjectArea
        name="Subject Areas"
        value={DatasetSearchFilter.SubjectArea}
        tooltip="The subject area of the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterDataType
        name="Data Types"
        value={DatasetSearchFilter.DataType}
        tooltip="The types of data in the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterFeatureType
        name="Feature Types"
        value={DatasetSearchFilter.FeatureType}
        tooltip="The types of features in the dataset"
        tooltipOpen={tooltipsOpen}
      />
    </Accordion>
  );
}
