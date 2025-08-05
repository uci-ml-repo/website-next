import type { ComponentProps } from "react";

import { DatasetSearchFilterPython } from "@/components/dataset/search/filter/items/dataset-search-filter-python";
import { DatasetSearchFilterSubjectArea } from "@/components/dataset/search/filter/items/dataset-search-filter-subject-area";
import { DatasetSearchFilter } from "@/components/hooks/use-dataet-search-filters";
import { Accordion } from "@/components/ui/accordion";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

export function DatasetSearchFiltersAccordion({ tooltipsOpen, className, ...props }: Props) {
  return (
    <Accordion className={cn(className)} {...props}>
      <DatasetSearchFilterPython
        name="Python Availability"
        value={DatasetSearchFilter.Python}
        tooltip="Whether the dataset is available for import in Python"
        tooltipOpen={tooltipsOpen}
      />
      <DatasetSearchFilterSubjectArea
        name="Subject Area"
        value={DatasetSearchFilter.SubjectArea}
        tooltip="The subject area of the dataset"
        tooltipOpen={tooltipsOpen}
      />
    </Accordion>
  );
}
