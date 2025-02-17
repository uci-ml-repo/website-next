"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { DatasetRowSkeleton } from "@/components/dataset/preview/DatasetRowSkeleton";
import { DatasetFiltersMobile } from "@/components/datasets/DatasetFiltersMobile";
import {
  DatasetSearchOrderBy,
  orderByOptions,
} from "@/components/datasets/DatasetSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import { SmartPagination } from "@/components/ui/smart-pagination";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSearch() {
  const { filters, setFilters, clearFilters, filterCountExcept } =
    useQueryFilters<DatasetQuery>();

  const [localOrder, setLocalOrder] = useState<string>(
    filters.search
      ? "relevance"
      : Object.keys(filters.order || {})[0] || "viewCount",
  );

  const handleOrderChange = (newOrder: string) => {
    if (localOrder !== newOrder) {
      setLocalOrder(newOrder);
    }
  };

  const filterCount =
    filterCountExcept({
      except: ["search", "order", "limit", "cursor"],
    }) -
    +(!!filters.instanceCountMax && !!filters.instanceCountMin) -
    +(!!filters.featureCountMax && !!filters.featureCountMin);

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch({ defaultValue: filters.search });

  useEffect(() => {
    if (searchValue && localOrder !== "relevance") {
      setLocalOrder("relevance");
    } else if (!searchValue && localOrder === "relevance") {
      setLocalOrder("viewCount");
    }
  }, [searchValue, localOrder]);

  // Update the URL filters whenever the debounced search value changes.
  useEffect(() => {
    const order =
      localOrder === "relevance"
        ? undefined
        : { [localOrder]: orderByOptions[localOrder].sort };

    setFilters({ search: searchValue, order: order, cursor: 0 });
  }, [searchValue, setFilters, localOrder]);

  const { data, isLoading, isFetching } = trpc.dataset.find.byQuery.useQuery(
    filters,
    {
      placeholderData: (prev) => prev,
    },
  );

  const limit = filters.limit || 10;
  const offset = filters.cursor || 0;

  return (
    <div className="flex flex-1 flex-col p-1">
      <h1 className="text-2xl font-bold max-lg:pb-2">Browse datasets</h1>
      <div className="space-y-4">
        <div className="flex w-full flex-col items-end justify-between gap-4 md:flex-row">
          <InputClearable
            placeholder="Search datasets"
            icon={SearchIcon}
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
            containerClassName="w-full"
            aria-label="Search datasets"
          />
          <div className="flex items-end max-lg:justify-between max-md:w-full">
            <div className="mr-4 lg:hidden">
              <DatasetFiltersMobile />
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground max-md:hidden">
                Sort By
              </div>
              <DatasetSearchOrderBy
                value={localOrder}
                onChange={handleOrderChange}
                searchActive={!!inputValue}
              />
            </div>
          </div>
        </div>

        {!data && isLoading ? (
          <div>
            {Array.from({ length: limit }).map((_, index) => (
              <React.Fragment key={index}>
                <DatasetRowSkeleton />
                <hr />
              </React.Fragment>
            ))}
          </div>
        ) : data?.datasets.length ? (
          <div className="space-y-6">
            <div>
              <div className="text-lg text-muted-foreground">
                Found {data.count}{" "}
                {data.datasets.length === 1 ? "dataset" : "datasets"}{" "}
                {filters.search && !isFetching ? `for '${filters.search}'` : ""}{" "}
                {filterCount
                  ? `matching ${filterCount} ${
                      filterCount === 1 ? "filter" : "filters"
                    }`
                  : ""}
              </div>
              <div>
                {data.datasets.map((dataset) => (
                  <React.Fragment key={dataset.id}>
                    <DatasetRow
                      hoverCard
                      dataset={dataset}
                      className="rounded-none"
                    />
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <SmartPagination
              totalCount={data.count}
              limit={limit}
              offset={offset}
              onPageChange={(newOffset) => setFilters({ cursor: newOffset })}
              onLimitChange={(newLimit) =>
                setFilters({ limit: newLimit, cursor: 0 })
              }
            />
          </div>
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
