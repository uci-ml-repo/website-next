import { useEffect, useState } from "react";

import { DatasetsFilterItem } from "@/components/datasets/DatasetsFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Multiselect } from "@/components/ui/multiselect";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetKeywordsFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    filters.keywords ?? [],
  );

  const { data } = trpc.keyword.find.approved.useQuery();

  useEffect(() => {
    if (selectedKeywords.length === 0) {
      setFilters({ keywords: undefined });
    } else {
      setFilters({ keywords: selectedKeywords });
    }
  }, [selectedKeywords, setFilters]);

  useEffect(() => {
    if (typeof filters.keywords === "undefined") {
      setFilters({ keywords: undefined });
      setSelectedKeywords([]);
    }
  }, [filters.keywords, setFilters]);

  return (
    <DatasetsFilterItem
      label="Keywords"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      tooltipOpen={tooltipOpen}
      tooltipContent="Keywords that describe the dataset"
      clearFilter={() => setFilters({ keywords: undefined })}
    >
      {data && (
        <Multiselect
          placeholder="Search keywords"
          selectedValues={selectedKeywords}
          setSelectedValues={setSelectedKeywords}
          values={data.map((keyword) => keyword.name)}
        />
      )}
    </DatasetsFilterItem>
  );
}
