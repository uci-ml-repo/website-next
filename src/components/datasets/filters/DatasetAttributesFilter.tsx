import { useEffect, useState } from "react";

import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Multiselect } from "@/components/ui/multiselect";
import { Spinner } from "@/components/ui/spinner";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetAttributesFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    filters.attributes ?? [],
  );

  useEffect(() => {
    if (selectedAttributes.length === 0) {
      setFilters({ attributes: undefined });
    } else {
      setFilters({ attributes: selectedAttributes });
    }
  }, [selectedAttributes, setFilters]);

  useEffect(() => {
    if (typeof filters.attributes === "undefined") {
      setFilters({ attributes: undefined });
      setSelectedAttributes([]);
    }
  }, [filters.attributes, setFilters]);

  const { data, isLoading } =
    trpc.variable.find.remainingFilters.useQuery(selectedAttributes);

  return (
    <DatasetsFilterItem
      label="Attributes"
      tooltipContent="The attributes (column variables) of the dataset"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      tooltipOpen={tooltipOpen}
      clearFilter={() => setFilters({ attributes: undefined })}
    >
      {isLoading && (
        <div className="h-10 flex w-full justify-center">
          <Spinner />
        </div>
      )}
      {data && (
        <Multiselect
          placeholder="Search keywords"
          selectedValues={selectedAttributes}
          setSelectedValues={setSelectedAttributes}
          values={data.keys().toArray()}
        />
      )}
    </DatasetsFilterItem>
  );
}
