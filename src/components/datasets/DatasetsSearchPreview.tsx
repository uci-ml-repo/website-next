"use client";

import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetsFilters from "@/components/datasets/DatasetsFilters";
import DatasetsSearchOrderBy from "@/components/datasets/DatasetsSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetsSearchPreview() {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch();

  useEffect(() => {
    setFilters({ search: searchValue });
  }, [searchValue, setFilters]);

  const datasetQueryMutation = trpc.dataset.find.byQuery.useQuery(filters);

  return (
    <div className="backdrop-gradient-blur flex">
      <div className="w-1/6">
        <DatasetsFilters />
      </div>
      <div className="w-5/6 space-y-6">
        <div className="flex w-full items-end justify-between space-x-2">
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
        {datasetQueryMutation.isLoading && (
          <div className="flex w-full justify-center">
            <Spinner className="size-10" />
          </div>
        )}
        <div>
          {datasetQueryMutation.data &&
            datasetQueryMutation.data.datasets.map((dataset) => (
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
    </div>
  );
}
