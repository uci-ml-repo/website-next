import type { ComponentProps } from "react";

import { DatasetSearchFilterDataType } from "@/components/dataset/search/filter/item/dataset-search-filter-data-type";
import { DatasetSearchFilterFeatureCount } from "@/components/dataset/search/filter/item/dataset-search-filter-feature-count";
import { DatasetSearchFilterFeatureType } from "@/components/dataset/search/filter/item/dataset-search-filter-feature-type";
import { DatasetSearchFilterInstanceCount } from "@/components/dataset/search/filter/item/dataset-search-filter-instance-count";
import { DatasetSearchFilterPython } from "@/components/dataset/search/filter/item/dataset-search-filter-python";
import { DatasetSearchFilterSubjectArea } from "@/components/dataset/search/filter/item/dataset-search-filter-subject-area";
import { DatasetSearchFilterTask } from "@/components/dataset/search/filter/item/dataset-search-filter-task";
import { DatasetSearchFilter } from "@/components/hooks/use-dataet-search-filters";
import { Accordion } from "@/components/ui/accordion";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

export function DatasetSearchFiltersAccordion({ tooltipsOpen, ...props }: Props) {
  return (
    <Accordion {...props}>
      <DatasetSearchFilterDataType
        name="Data Types"
        value={DatasetSearchFilter.DataTypes}
        tooltip="The types of data in the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterSubjectArea
        name="Subject Areas"
        value={DatasetSearchFilter.SubjectAreas}
        tooltip="The subject area of the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterTask
        name="Tasks"
        value={DatasetSearchFilter.Tasks}
        tooltip="The tasks that the dataset is suitable for"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterInstanceCount
        name="Number of Instances"
        value={DatasetSearchFilter.InstanceCount}
        tooltip="The number of instances (rows) in the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterFeatureCount
        name="Number of Features"
        value={DatasetSearchFilter.FeatureCount}
        tooltip="The number of features (columns) in the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterFeatureType
        name="Feature Types"
        value={DatasetSearchFilter.FeatureTypes}
        tooltip="The types of features in the dataset"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterPython
        name="Python Availability"
        value={DatasetSearchFilter.Python}
        tooltip="Whether the dataset is available for import in Python"
        tooltipOpen={tooltipsOpen}
      />
    </Accordion>
  );
}
