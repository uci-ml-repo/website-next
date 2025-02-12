import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Multiselect } from "@/components/ui/multiselect";
import { Spinner } from "@/components/ui/spinner";
import type { DatasetQuery } from "@/server/schema/dataset";

interface GenericFilterProps extends DatasetFiltersProps {
  label: string;
  tooltipContent: string;
  placeholder: string;
  filterKey: keyof DatasetQuery;
  useData: (selectedValues: string[]) => {
    data: string | Map<string, string | number> | undefined;
    isLoading: boolean;
    isError: boolean;
  };
}

export function DatasetMultiSelectFilter({
  label,
  tooltipContent,
  placeholder,
  filterKey,
  useData,
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: GenericFilterProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const [selectedValues, setSelectedValues] = useState<string[]>(
    (filters[filterKey] as string[]) ?? [],
  );

  useEffect(() => {
    if (selectedValues.length === 0) {
      setFilters({ [filterKey]: undefined });
    } else {
      setFilters({ [filterKey]: selectedValues });
    }
  }, [selectedValues, setFilters, filterKey]);

  useEffect(() => {
    if (typeof filters[filterKey] === "undefined") {
      setFilters({ [filterKey]: undefined });
      setSelectedValues([]);
    }
  }, [filters, setFilters, filterKey]);

  const { data, isLoading, isError } = useData(selectedValues);

  // If the data is a Map, transform it into an array of "key value" strings.
  // Otherwise, assume it's already an array of strings.
  const values: string[] = data
    ? data instanceof Map
      ? Array.from(data.entries()).map(([key, value]) => `${key} ${value}`)
      : (data as unknown as string[])
    : [];

  return (
    <DatasetsFilterItem
      label={label}
      tooltipContent={tooltipContent}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      tooltipOpen={tooltipOpen}
      active={selectedValues.length > 0}
      activeCount={selectedValues.length}
      clearFilter={() => setFilters({ [filterKey]: undefined })}
    >
      {isError && (
        <Alert variant="destructive">
          <div className="flex items-center space-x-2">
            <AlertCircleIcon className="size-4" />
            <AlertDescription>
              Error loading {label.toLowerCase()} filters
            </AlertDescription>
          </div>
        </Alert>
      )}
      {isLoading && (
        <div className="h-10 flex w-full justify-center">
          <Spinner />
        </div>
      )}
      {data && (
        <Multiselect
          placeholder={placeholder}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          values={values}
        />
      )}
    </DatasetsFilterItem>
  );
}
