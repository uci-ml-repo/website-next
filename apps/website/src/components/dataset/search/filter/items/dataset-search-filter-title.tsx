import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { SearchInput } from "@/components/ui/input";

export function DatasetSearchFilterTitle() {
  const { filterTitle, setFilterTitle } = useDatasetSearchFilters();

  return (
    <div>
      <SearchInput
        placeholder="Search datasets"
        size="md"
        value={filterTitle ?? ""}
        setValue={setFilterTitle}
      />
    </div>
  );
}
