import type { ComponentProps } from "react";

import { DatasetFilterDataType } from "@/components/dataset/search/filter/item/dataset-filter-data-type";
import { DatasetFilterFeatureCount } from "@/components/dataset/search/filter/item/dataset-filter-feature-count";
import { DatasetFilterFeatureType } from "@/components/dataset/search/filter/item/dataset-filter-feature-type";
import { DatasetFilterFeatures } from "@/components/dataset/search/filter/item/dataset-filter-features";
import { DatasetFilterInstanceCount } from "@/components/dataset/search/filter/item/dataset-filter-instance-count";
import { DatasetFilterKeywords } from "@/components/dataset/search/filter/item/dataset-filter-keywords";
import { DatasetFilterPython } from "@/components/dataset/search/filter/item/dataset-filter-python";
import { DatasetFilterSubjectArea } from "@/components/dataset/search/filter/item/dataset-filter-subject-area";
import { DatasetFilterTask } from "@/components/dataset/search/filter/item/dataset-filter-task";
import { Accordion } from "@/components/ui/accordion";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

const filters = [
  {
    component: DatasetFilterKeywords,
    name: "Keywords",
    tooltip: "Keywords that describe the dataset",
  },
  {
    component: DatasetFilterFeatures,
    name: "Features",
    tooltip: "The features (variables) of the dataset",
  },
  {
    component: DatasetFilterDataType,
    name: "Data Types",
    tooltip: "The types of data in the dataset",
  },
  {
    component: DatasetFilterSubjectArea,
    name: "Subject Areas",
    tooltip: "The subject area of the dataset",
  },
  {
    component: DatasetFilterTask,
    name: "Tasks",
    tooltip: "The tasks that the dataset is suitable for",
  },
  {
    component: DatasetFilterFeatureType,
    name: "Feature Types",
    tooltip: "The types of features in the dataset",
  },
  {
    component: DatasetFilterInstanceCount,
    name: "Number of Instances",
    tooltip: "The number of instances (rows) in the dataset",
  },
  {
    component: DatasetFilterFeatureCount,
    name: "Number of Features",
    tooltip: "The number of features (columns) in the dataset",
  },
  {
    component: DatasetFilterPython,
    name: "Python Availability",
    tooltip: "Whether the dataset is available for import in Python",
  },
];

export function DatasetFiltersAccordion({ tooltipsOpen, ...props }: Props) {
  return (
    <Accordion {...props}>
      {filters.map(({ component: Component, name, tooltip }) => (
        <Component
          key={name}
          value={name}
          name={name}
          tooltip={tooltip}
          tooltipOpen={tooltipsOpen}
        />
      ))}
    </Accordion>
  );
}

export const filterNames = filters.map((filter) => filter.name);
