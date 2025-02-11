import { useEffect, useState } from "react";

import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
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
      setFilters({ keywords: undefined });
    } else {
      setFilters({ keywords: selectedAttributes });
    }
  }, [selectedAttributes, setFilters]);

  useEffect(() => {
    if (typeof filters.keywords === "undefined") {
      setFilters({ keywords: undefined });
      setSelectedAttributes([]);
    }
  }, [filters.keywords, setFilters]);

  const attributesQuery =
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
      <div>{JSON.stringify(attributesQuery.data ?? [])}</div>
      {/*<Multiselect placeholder="Attribute" />*/}
    </DatasetsFilterItem>
  );
}
