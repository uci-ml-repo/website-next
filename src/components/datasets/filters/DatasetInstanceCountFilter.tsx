import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetInstanceCountFilter({
  tooltipOpen,
}: {
  tooltipOpen: boolean;
}) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Instance Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of instances (rows of data)"
      clearFilter={() =>
        setFilters({
          instanceCountMin: undefined,
          instanceCountMax: undefined,
        })
      }
    >
      <div>Stuff</div>
    </DatasetFilterItem>
  );
}
