"use client";

import { FilterIcon } from "lucide-react";
import React from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetsSearchOrderBy from "@/components/datasets/DatasetsSearchOrderBy";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Spinner from "@/components/ui/spinner";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetsSearch() {
  const { filters } = useQueryFilters<DatasetQuery>();

  const datasetQueryMutation = trpc.dataset.find.byQuery.useQuery(filters);

  return (
    <div className="backdrop-gradient-blur space-y-8">
      <div className="flex">
        <div className="w-80 max-md:hidden">Filters</div>
        <div className="flex w-full items-center justify-between">
          <div>Search</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="blue">
                <FilterIcon />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80dvh]">
              <SheetTitle>Filters</SheetTitle>
            </SheetContent>
          </Sheet>
          <DatasetsSearchOrderBy />
        </div>
      </div>
      <div>
        {datasetQueryMutation.isLoading && (
          <div className="flex w-full justify-center">
            <Spinner className="size-10" />
          </div>
        )}
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
  );
}
