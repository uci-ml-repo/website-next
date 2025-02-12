import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { DatasetMultiSelectFilter } from "@/components/datasets/multiselect/DatasetsMultiselectFilter";
import { trpc } from "@/server/trpc/query/client";

export function DatasetAttributesFilter(props: DatasetFiltersProps) {
  return (
    <DatasetMultiSelectFilter
      {...props}
      label="Attributes"
      tooltipContent="The attributes (column variables) of the dataset"
      placeholder="Search attributes"
      filterKey="attributes"
      useData={(selectedValues) =>
        trpc.variable.find.remainingFilters.useQuery(selectedValues)
      }
    />
  );
}
