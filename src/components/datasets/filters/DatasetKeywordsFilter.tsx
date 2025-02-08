import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetKeywordsFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  const { data, isLoading } = trpc.keyword.find.approved.useQuery();

  return (
    <DatasetFilterItem
      label="Keywords"
      tooltipOpen={tooltipOpen}
      tooltipContent="Keywords that describe the dataset"
      clearFilter={() => setFilters({ keywords: undefined })}
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
