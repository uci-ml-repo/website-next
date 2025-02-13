"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import React, { useEffect } from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { DatasetRowSkeleton } from "@/components/dataset/preview/DatasetRowSkeleton";
import { DatasetsSearchOrderBy } from "@/components/datasets/DatasetsSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export function DatasetsSearch() {
  const { filters, setFilters, filterCount, clearFilters } =
    useQueryFilters<DatasetQuery>();

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch({ defaultValue: filters.search });

  const trueFilterCount =
    filterCount - (!!filters.search ? 1 : 0) - (!!filters.order ? 1 : 0);

  useEffect(() => {
    setFilters({ search: searchValue });
  }, [searchValue, setFilters]);

  useEffect(() => {
    if (!filters.search) {
      setInputValue("");
    }
  }, [filters.search, setInputValue]);

  const { data, isLoading } = trpc.dataset.find.byQuery.useQuery(filters);

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
          />
          <DatasetsSearchOrderBy />
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
          <div>
            {(!!trueFilterCount || filters.search) && (
              <div className="text-lg text-muted-foreground">
                Found {data.count}{" "}
                {data.datasets.length === 1 ? "dataset" : "datasets"}
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
