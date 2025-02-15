"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { DatasetRowSkeleton } from "@/components/dataset/preview/DatasetRowSkeleton";
import {
  DatasetsSearchOrderBy,
  orderByOptions,
} from "@/components/datasets/DatasetsSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import { SmartPagination } from "@/components/ui/smart-pagination";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetsSearch() {
  const { filters, setFilters, clearFilters, filterCountExcept } =
    useQueryFilters<DatasetQuery>();

  const [localOrder, setLocalOrder] = useState<string>(
    filters.search
      ? "relevance"
      : Object.keys(filters.order || {})[0] || "viewCount",
  );

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch({ defaultValue: filters.search });

  const filterCount = filterCountExcept({
    except: ["search", "order", "limit", "cursor"],
  });

  // Optionally adjust the local order based on searchValue.
  useEffect(() => {
    if (searchValue && localOrder !== "relevance") {
      setLocalOrder("relevance");
    } else if (!searchValue && localOrder === "relevance") {
      setLocalOrder("viewCount");
    }
  }, [searchValue, localOrder]);

  // Update the URL filters whenever the debounced search value changes.
  useEffect(() => {
    const orderFilter =
      localOrder === "relevance"
        ? undefined
        : { [localOrder]: orderByOptions[localOrder].sort };

    const currentSearch = filters.search || "";
    const currentOrder = filters.order
      ? Object.keys(filters.order)[0]
      : filters.search
        ? "relevance"
        : "viewCount";

    if (searchValue === currentSearch && localOrder === currentOrder) return;

    setFilters({ search: searchValue, order: orderFilter });
  }, [searchValue, localOrder, filters, setFilters]);

  useEffect(() => {
    if (!filters.search) {
      setInputValue("");
    }
  }, [filters.search, setInputValue]);

  const handleOrderChange = (newOrder: string) => {
    if (localOrder !== newOrder) {
      setLocalOrder(newOrder);
    }
  };

  const { data, isLoading } = trpc.dataset.find.byQuery.useQuery(filters);

  const limit = filters.limit || 10;
  const offset = filters.cursor || 0;

  return (
    <div className="flex flex-1 flex-col p-1">
      <h1 className="text-2xl font-bold">Browse datasets</h1>
      <div className="space-y-4">
        <div className="flex w-full items-end justify-between space-x-4">
          <InputClearable
            variantSize="lg"
            placeholder="Search datasets"
            icon={SearchIcon}
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
            containerClassName="w-full"
            aria-label="Search datasets"
          />
          <DatasetsSearchOrderBy
            value={localOrder}
            onChange={handleOrderChange}
            searchActive={!!inputValue}
          />
        </div>

        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <React.Fragment key={index}>
                <DatasetRowSkeleton />
                <hr />
              </React.Fragment>
            ))}
          </div>
        ) : data?.datasets.length ? (
          <div className="space-y-6">
            <div>
              {(!!filterCount || filters.search) && (
                <div className="text-lg text-muted-foreground">
                  Found {data.count}{" "}
                  {data.datasets.length === 1 ? "dataset" : "datasets"}{" "}
                  {filters.search ? `for '${filters.search}'` : ""}{" "}
                  {filterCount
                    ? `matching ${filterCount} ${
                        filterCount === 1 ? "filter" : "filters"
                      }`
                    : ""}
                </div>
              )}
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
