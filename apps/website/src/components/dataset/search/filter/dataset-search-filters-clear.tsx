import { XIcon } from "lucide-react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Button } from "@/components/ui/button";

export function DatasetSearchFiltersClear() {
  const { anyFilterActive, clearFilters } = useDatasetSearchFilters();

  return (
    anyFilterActive && (
      <Button
        variant="secondary"
        size="xs"
        onClick={clearFilters}
        className="hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
      >
        <XIcon />
        Clear Filters
      </Button>
    )
  );
}
