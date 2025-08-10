"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import type { HTMLAttributes } from "react";

import { DatasetRow } from "@/components/dataset/preview/dataset-row";
import { DatasetRowSkeleton } from "@/components/dataset/preview/dataset-row-skeleton";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/util/cn";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetSearchResults() {
  const { nonSearchFilterCount, debouncedFilters, filters, search } = useDatasetSearchFilters();

  const { data, isFetching, error } = trpc.dataset.find.byQuery.useQuery(
    {
      ...filters,
      ...debouncedFilters,
    },
    {
      placeholderData: (prev) => prev,
      ...skipBatch,
    },
  );

  return (
    <div>
      {!data ? (
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, index) => (
            <DatasetRowSkeleton key={index} />
          ))}
        </div>
      ) : data.datasets.length ? (
        <>
          <SearchMessage
            datasetCount={data.count}
            filterCount={nonSearchFilterCount}
            search={search}
            isFetching={isFetching}
            error={error?.message}
            className="max-md:hidden"
          />
          <div className="divide-y">
            {data.datasets &&
              data.datasets.map((dataset) => <DatasetRow key={dataset.id} dataset={dataset} />)}
          </div>
        </>
      ) : (
        <div>None</div>
      )}
    </div>
  );
}

function SearchMessage({
  datasetCount,
  filterCount,
  search,
  isFetching,
  error,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  datasetCount: number;
  filterCount: number;
  search?: string;
  isFetching: boolean;
  error?: string;
}) {
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
    !!filterCount && `matching ${filterCount} filter${filterCount !== 1 ? "s" : ""}`;

  return (
    (filterCount || search) && (
      <div className={cn("text-muted-foreground px-2 text-lg wrap-anywhere", className)} {...props}>
        Found {countMessage} {searchMessage} {filterMessage}
      </div>
    )
  );
}
