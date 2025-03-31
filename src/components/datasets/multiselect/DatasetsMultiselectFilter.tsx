"use client";

import { isEqual } from "lodash";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import type { DatasetFilterProps } from "@/components/datasets/DatasetFiltersContent";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Multiselect } from "@/components/ui/multiselect";
import type { DatasetQuery } from "@/server/schema/dataset";

interface DatasetMultiSelectFilterProps extends DatasetFilterProps {
  label: string;
  tooltipContent: string;
  placeholder: string;
  filterKey: keyof DatasetQuery;
  filterValues: string[] | undefined;
  useData: (selectedValues: string[]) => {
    data: string[] | Map<string, string | number> | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  emptyMessage?: string;
}

export function DatasetMultiSelectFilter({
  label,
  tooltipContent,
  placeholder,
  filterKey,
  filterValues,
  useData,
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
  emptyMessage,
}: DatasetMultiSelectFilterProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();
  const initialized = useRef<boolean>(false);

  const [selectedValues, setSelectedValues] = useState<string[]>(
    (filters[filterKey] as string[]) ?? [],
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    if (!isEqual(filterValues ?? [], selectedValues)) {
      setFilters({
        [filterKey]: selectedValues.length ? selectedValues : undefined,
        cursor: 0,
      });
    } else {
      setFilters({
        [filterKey]: selectedValues.length ? selectedValues : undefined,
      });
    }
  }, [selectedValues, filterKey, setFilters, filterValues]);

  useEffect(() => {
    if (!filterValues) {
      setSelectedValues([]);
    }
  }, [filterValues]);

  const { data, isLoading, isError } = useData(selectedValues);

  return (
    <DatasetFilterItem
      label={label}
      tooltipContent={tooltipContent}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      tooltipOpen={tooltipOpen}
      active={selectedValues.length > 0}
      activeCount={selectedValues.length}
      clearFilter={() => {
        setSelectedValues([]);
        setFilters({ [filterKey]: undefined });
      }}
    >
      {isError ? (
        <Alert variant="destructive">
          <div className="flex items-center space-x-2">
            <AlertCircleIcon className="size-4" />
            <AlertDescription>Error loading {label.toLowerCase()} filters</AlertDescription>
          </div>
        </Alert>
      ) : (
        <Multiselect
          placeholder={placeholder}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          values={data ?? []}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      )}
    </DatasetFilterItem>
  );
}
