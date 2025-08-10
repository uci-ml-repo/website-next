"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import type { HTMLAttributes } from "react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/util/cn";

export function DatasetSearchMessage({
  datasetCount,
  isFetching,
  error,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  datasetCount: number;
  isFetching: boolean;
  error?: string;
}) {
  const { search, nonSearchFilterCount } = useDatasetSearchFilters();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Search Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const countMessage = (
    <>
      {isFetching ? (
        <Loader2Icon className="inline size-5 -translate-y-0.5 animate-spin" />
      ) : (
        datasetCount.toLocaleString()
      )}{" "}
      dataset{datasetCount !== 1 && "s"}
    </>
  );

  const searchMessage =
    search && `for "${search.length > 30 ? search.slice(0, 30) + "..." : search}"`;

  const filterMessage =
    !!nonSearchFilterCount &&
    `matching ${nonSearchFilterCount} filter${nonSearchFilterCount !== 1 ? "s" : ""}`;

  return (
    (nonSearchFilterCount || search) && (
      <div className={cn("text-muted-foreground px-2 text-lg wrap-anywhere", className)} {...props}>
        Found {countMessage} {searchMessage} {filterMessage}
      </div>
    )
  );
}
