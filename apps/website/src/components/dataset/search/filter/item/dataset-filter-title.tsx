"use client";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { SearchInput } from "@/components/ui/input";

export function DatasetFilterTitle() {
  const { search, setSearch } = useDatasetSearchFilters();

  return (
    <div className="w-full">
      <SearchInput
        placeholder="Search datasets"
        size="md"
        value={search ?? ""}
        setValue={setSearch}
        className="bg-background"
        aria-label="Search datasets by title"
      />
    </div>
  );
}
