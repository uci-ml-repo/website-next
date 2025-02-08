import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Checkbox } from "@/components/ui/checkbox";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetPythonFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  return (
    <DatasetFilterItem
      label="Python Available"
      tooltipOpen={tooltipOpen}
      tooltipContent="Whether the dataset is available for import in Python"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={filters.python}
      clearFilter={() => setFilters({ python: undefined })}
    >
      <div className="flex w-full items-center justify-between">
        <span>Available for Python import</span>
        <Checkbox
          checked={!!filters.python}
          onCheckedChange={(checked) =>
            setFilters({ python: checked as boolean })
          }
        />
      </div>
    </DatasetFilterItem>
  );
}
