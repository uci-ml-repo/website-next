import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetMultiSelectFilter } from "@/components/datasets/multiselect/DatasetsMultiselectFilter";
import { trpc } from "@/server/trpc/query/client";

export function DatasetAttributesFilter(props: DatasetFilterProps) {
  return (
    <DatasetMultiSelectFilter
      {...props}
      label="Attributes"
      tooltipContent="The attributes (column variables) of the dataset"
      placeholder="Search attributes"
      filterKey="attributes"
      useData={(selectedValues) =>
        trpc.variable.find.remainingFilters.useQuery(
          { attributeFilters: selectedValues },
          {
            trpc: {
              context: {
                skipBatch: true,
              },
            },
          },
        )
      }
    />
  );
}
