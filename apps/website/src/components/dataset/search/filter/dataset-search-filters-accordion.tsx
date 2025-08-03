import type { ComponentProps } from "react";

import { DatasetSearchPythonFilter } from "@/components/dataset/search/filter/items/dataset-search-python-filter";
import { DatasetSearchSubjectAreaFilter } from "@/components/dataset/search/filter/items/dataset-search-subject-area-filter";
import { Accordion } from "@/components/ui/accordion";

import { DatasetSearchFilterAccordionItem } from "./items/dataset-search-filter-accordion-item";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

export const searchFilters = [
  {
    name: "Subject Area",
    tooltip: "The subject area of the dataset",
    content: <DatasetSearchSubjectAreaFilter />,
  },
  {
    name: "Python Availability",
    tooltip: "Whether the dataset is available for import in Python",
    content: <DatasetSearchPythonFilter />,
  },
];

export function DatasetSearchFiltersAccordion({ tooltipsOpen, ...props }: Props) {
  return (
    <Accordion {...props}>
      {searchFilters.map(({ name, tooltip, content }) => (
        <DatasetSearchFilterAccordionItem
          key={name}
          name={name}
          value={name}
          tooltip={tooltip}
          tooltipOpen={tooltipsOpen}
        >
          {content}
        </DatasetSearchFilterAccordionItem>
      ))}
    </Accordion>
  );
}
