import { XIcon } from "lucide-react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Button } from "@/components/ui/button";

export function DatasetFiltersClear() {
  const { anyFilterActive, clearFilters } = useDatasetSearchFilters();

  return (
    anyFilterActive && (
      <Button variant="secondary" size="xs" onClick={clearFilters}>
        <XIcon />
        Clear Filters
      </Button>
    )
  );
}
