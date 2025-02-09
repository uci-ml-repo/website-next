import { useState } from "react";

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
  const { setFilters } = useQueryFilters<DatasetQuery>();

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const { data } = trpc.keyword.find.approved.useQuery();

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
