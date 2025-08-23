"use client";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { SearchInput } from "@/components/ui/input";

export function DatasetFilterSearch() {
  const { search, setSearch } = useDatasetSearchFilters();

  return (
    <div className="w-full">
      <SearchInput
        placeholder="Search datasets"
        size="md"
        value={search ?? ""}
        setValue={setSearch}
        className="bg-background"
        inputProps={{ "aria-label": "Search datasets by title" }}
      />
    </div>
  );
}
