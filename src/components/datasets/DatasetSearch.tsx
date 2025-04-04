"use client";

import { isEqual } from "lodash";
import { Undo2Icon } from "lucide-react";
import React from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { DatasetRowSkeleton } from "@/components/dataset/preview/DatasetRowSkeleton";
import { DatasetFiltersDesktop } from "@/components/datasets/DatasetFiltersDesktop";
import { DatasetSearchInput } from "@/components/datasets/DatasetSearchInput";
import { usePrevious } from "@/components/hooks/use-previous";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { ScrollGradient } from "@/components/ui/scroll-gradient";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSearch() {
  const { filters, setFilters, clearFilters, filterCountExcept } = useQueryFilters<DatasetQuery>();

  const filterCount =
    filterCountExcept({
      except: ["search", "order", "limit", "cursor"],
    }) -
    +(!!filters.instanceCountMax && !!filters.instanceCountMin) -
    +(!!filters.featureCountMax && !!filters.featureCountMin);

  const { data, isLoading, isFetching } = trpc.dataset.find.byQuery.useQuery(filters, {
    placeholderData: (prev) => prev,
  });

  const limit = filters.limit || 10;
  const offset = filters.cursor || 0;

  const prevOrder = usePrevious(filters.order);
  const prevLimit = usePrevious(filters.limit);
  const prevCursor = usePrevious(filters.cursor);

  const isFiltering =
    isFetching &&
    isEqual(prevOrder, filters.order) &&
    prevLimit === filters.limit &&
    prevCursor === filters.cursor;

  return (
    <div className="flex gap-4">
      <DatasetFiltersDesktop className="mt-4 w-60 shrink-0 max-lg:hidden xl:w-72" />

      <div
        className={cn(
          "backdrop-gradient-blur h-[calc(100svh-var(--header-height))]",
          "flex w-full flex-col overflow-hidden pb-6",
        )}
      >
        <div className="flex w-full min-w-0 shrink-0 flex-col">
          <h1 className="text-2xl font-bold max-lg:pb-2">Browse datasets</h1>
          <DatasetSearchInput />
        </div>
        {!data && isLoading ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="divide-y">
              {Array.from({ length: limit }).map((_, index) => (
                <DatasetRowSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : data?.datasets.length ? (
          <>
            <div className="mb-2 flex flex-1 flex-col overflow-hidden">
              <div className="ml-2 mt-2 flex items-center text-lg text-muted-foreground">
                Found{" "}
                {isFiltering ? <Spinner className="mx-1 size-5" /> : data.count.toLocaleString()}{" "}
                {data.datasets.length === 1 ? "dataset" : "datasets"}{" "}
                {filters.search && !isLoading ? `for '${filters.search}'` : ""}{" "}
                {filterCount
                  ? `matching ${filterCount} ${filterCount === 1 ? "filter" : "filters"}`
                  : ""}
                {!isFiltering && isFetching && <Spinner className="mx-1 size-5" />}
              </div>
              <ScrollGradient
                containerClassName="flex min-h-0 flex-1"
                className="min-h-0 flex-1 divide-y overflow-y-auto"
                orientation="vertical"
                gradientClassName="from-background h-8"
              >
                {data.datasets.map((dataset) => (
                  <DatasetRow hoverCard dataset={dataset} key={dataset.id} />
                ))}
                <hr />
              </ScrollGradient>
            </div>
            <SmartPagination
              totalCount={data.count}
              limit={limit}
              offset={offset}
              onPageChange={(newOffset) => setFilters({ cursor: newOffset })}
              onLimitChange={(newLimit) => setFilters({ limit: newLimit, cursor: 0 })}
            />
          </>
        ) : (
          <div className="flex h-20 flex-col items-center justify-center space-y-2">
            <div className="text-muted-foreground">No datasets found</div>
            <Button variant="secondary" onClick={() => clearFilters()}>
              Clear search <Undo2Icon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
