import { XIcon } from "lucide-react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Button } from "@/components/ui/button";

export function DatasetFiltersClear() {
  const { anyFilterActive, clearFilters } = useDatasetSearchFilters();

  return (
    anyFilterActive && (
      <Button
        variant="secondary"
        size="xs"
        onClick={clearFilters}
        className="hover:bg-accent focus:bg-accent"
      >
        <XIcon />
        Clear Filters
      </Button>
    )
  );
}
