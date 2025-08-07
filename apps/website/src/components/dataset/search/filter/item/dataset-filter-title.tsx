import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { SearchInput } from "@/components/ui/input";

export function DatasetFilterTitle() {
  const { search, setSearch } = useDatasetSearchFilters();

  return (
    <SearchInput
      placeholder="Search datasets"
      size="md"
      value={search ?? ""}
      setValue={setSearch}
      aria-label="Search datasets by title"
    />
  );
}
