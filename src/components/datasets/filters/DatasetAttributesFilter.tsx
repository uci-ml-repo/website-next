import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetMultiSelectFilter } from "@/components/datasets/multiselect/DatasetsMultiselectFilter";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetAttributesFilter(props: DatasetFilterProps) {
  const { filters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetMultiSelectFilter
      {...props}
      label="Attributes"
      tooltipContent="The attributes (column variables) of the dataset"
      placeholder="Search attributes"
      filterKey="attributes"
      useData={(selectedValues) =>
        trpc.variable.find.remainingFilters.useQuery(
          { attributeFilters: selectedValues, query: filters },
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
