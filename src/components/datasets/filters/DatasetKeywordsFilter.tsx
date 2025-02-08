import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { TooltipContent } from "@/components/ui/tooltip";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetKeywordsFilter({
  tooltipOpen,
}: {
  tooltipOpen?: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <>
      <DatasetFilterItem
        label="Keywords"
        clearFilter={() => setFilters({ keywords: undefined })}
      >
        <div>Stuff</div>
      </DatasetFilterItem>

      <TooltipContent>XX</TooltipContent>
    </>
  );
}
