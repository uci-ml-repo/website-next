"use client";

import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetRowSkeleton from "@/components/dataset/preview/DatasetRowSkeleton";
import DatasetsFilters from "@/components/datasets/DatasetsFilters";
import DatasetsSearchOrderBy from "@/components/datasets/DatasetsSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { InputClearable } from "@/components/ui/input-clearable";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetsSearch() {
  const { filters, setFilters, filterCount } = useQueryFilters<DatasetQuery>();

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch();

  const trueFilterCount =
    filterCount - (!!filters.search ? 1 : 0) - (!!filters.order ? 1 : 0);

  useEffect(() => {
    setFilters({ search: searchValue });
  }, [searchValue, setFilters]);

  const { data, isLoading } = trpc.dataset.find.byQuery.useQuery(filters);

  const { data: pureSearchData, isLoading: pureSearchIsLoading } =
    trpc.dataset.find.byQuery.useQuery(
      {
        search: searchValue,
      },
      {
        enabled: !!searchValue && data && data.datasets.length === 0,
      },
    );

  return (
    <div className="backdrop-gradient-blur flex space-x-4">
      <div className="w-72 max-lg:hidden">
        <DatasetsFilters />
      </div>
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
          {isLoading && (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <React.Fragment key={index}>
                  <DatasetRowSkeleton />
                  <hr />
                </React.Fragment>
              ))}
            </div>
          )}
          <div>
            {data &&
              (data.datasets.length > 0 ? (
                <div>
                  {(!!trueFilterCount || filters.search) && (
                    <div className="text-lg text-muted-foreground">
                      Found {data.datasets.length}{" "}
                      {data.datasets.length === 1 ? "dataset" : "datasets"}{" "}
                      {filters.search && `for '${filters.search}'`}
                      {!!trueFilterCount &&
                        `matching ${trueFilterCount} ${trueFilterCount ? "filter" : "filters"}`}
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
              ) : searchValue &&
                ((pureSearchData && pureSearchData.datasets.length > 0) ||
                  pureSearchIsLoading) ? (
                pureSearchData ? (
                  <div>
                    <div>
                      No datasets matching those filters, but these match your
                      search
                    </div>
                    <div>
                      {pureSearchData.datasets.map((dataset) => (
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
                  <div>Shit outta luck</div>
                )
              ) : (
                <div>Shit outta luck</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
