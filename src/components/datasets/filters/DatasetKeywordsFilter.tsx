import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { DatasetMultiSelectFilter } from "@/components/datasets/multiselect/DatasetsMultiselectFilter";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetKeywordsFilter(props: DatasetFilterProps) {
  const { filters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetMultiSelectFilter
      {...props}
      label="Keywords"
      tooltipContent="Keywords that describe the dataset"
      placeholder="Search keywords"
      filterKey="keywords"
      filterValues={filters.keywords}
      useData={() =>
        trpc.keyword.find.approved.useQuery(undefined, {
          trpc: {
            context: {
              skipBatch: true,
            },
          },
        })
      }
    />
  );
}
