import { XIcon } from "lucide-react";

import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

export function DatasetFiltersClear() {
  const { clearFilters, filterActive } = useQueryFilters<DatasetQuery>();

  return (
    filterActive({ except: ["order", "limit", "cursor"] }) && (
      <Button
        variant="secondary"
        size="xs"
        className={cn(
          "animate-in fade-in-0 slide-in-from-right",
          "hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground",
        )}
        onClick={() => clearFilters({ except: ["order"] })}
      >
        <XIcon />
        Clear
      </Button>
    )
  );
}
