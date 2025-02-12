import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { DatasetMultiSelectFilter } from "@/components/datasets/multiselect/DatasetsMultiselectFilter";
import { trpc } from "@/server/trpc/query/client";

export function DatasetKeywordsFilter(props: DatasetFiltersProps) {
  return (
    <DatasetMultiSelectFilter
      {...props}
      label="Keywords"
      tooltipContent="Keywords that describe the dataset"
      placeholder="Search keywords"
      filterKey="keywords"
      useData={() => trpc.keyword.find.approved.useQuery()}
    />
  );
}
