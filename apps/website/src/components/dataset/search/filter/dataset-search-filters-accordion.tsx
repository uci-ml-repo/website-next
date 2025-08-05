import type { ComponentProps } from "react";

import { DatasetSearchPythonFilter } from "@/components/dataset/search/filter/items/dataset-search-python-filter";
import { DatasetSearchFilter } from "@/components/hooks/use-dataet-search-filters";
import { Accordion } from "@/components/ui/accordion";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof Accordion> & {
  tooltipsOpen?: boolean;
};

export function DatasetSearchFiltersAccordion({ tooltipsOpen, className, ...props }: Props) {
  return (
    <Accordion className={cn(className)} {...props}>
      <DatasetSearchPythonFilter
        name="Python Availability"
        value={DatasetSearchFilter.Python}
        tooltip="Whether the dataset is available for import in Python"
        tooltipOpen={tooltipsOpen}
      />
    </Accordion>
  );
}
