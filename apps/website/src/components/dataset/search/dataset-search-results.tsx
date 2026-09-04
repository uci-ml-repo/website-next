"use client";

import { Enums } from "@packages/db/enum";
import { Undo2Icon } from "lucide-react";

import { DatasetRow } from "@/components/dataset/preview/dataset-row";
import { DatasetRowSkeleton } from "@/components/dataset/preview/dataset-row-skeleton";
import { DatasetSearchMessage } from "@/components/dataset/search/dataset-search-message";
import { ADMIN_DATASET_ORDER } from "@/components/dataset/search/filter/item/dataset-filter-order";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataset-search-filters";
import { Button } from "@/components/ui/button";
import { PaginationNav } from "@/components/ui/pagination-nav";
import { skipBatch, trpc } from "@/server/trpc/query/client";

const ADMIN_DEFAULT_STATUS = [Enums.ApprovalStatus.PENDING];

export function DatasetSearchResults({ privileged = false }: { privileged?: boolean }) {
  const { debouncedFilters, filters, setLimit, clearFilters, status } = useDatasetSearchFilters();

  const publicInput = {
    ...filters,
    ...debouncedFilters,
  };

  const privilegedInput = {
    ...publicInput,
    status: status ?? ADMIN_DEFAULT_STATUS,
    order: filters.order ?? ADMIN_DATASET_ORDER,
  };

  const publicQuery = trpc.dataset.find.byQuery.useQuery(publicInput, {
    placeholderData: (prev) => prev,
    enabled: !privileged,
    ...skipBatch,
  });

  const privilegedQuery = trpc.dataset.find.privilegedByQuery.useQuery(privilegedInput, {
    placeholderData: (prev) => prev,
    enabled: privileged,
    ...skipBatch,
  });

  const { data, isFetching, error } = privileged ? privilegedQuery : publicQuery;

  return !data ? (
    <div className="divide-y">
      {Array.from({ length: filters.limit }).map((_, index) => (
        <DatasetRowSkeleton key={index} />
      ))}
    </div>
  ) : data.datasets.length ? (
    <div>
      <DatasetSearchMessage
        datasetCount={data.count}
        isFetching={isFetching}
        error={error?.message}
        className="max-md:hidden"
      />

      <div className="space-y-4">
        <div className="divide-y">
          {data.datasets.map((dataset) => (
            <DatasetRow key={dataset.id} dataset={dataset} hoverCard showStatus={privileged} />
          ))}
        </div>

        <PaginationNav
          totalCount={data.count}
          limit={filters.limit}
          cursor={filters.cursor ?? 0}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="text-muted-foreground md:hidden">No datasets found</div>
      <DatasetSearchMessage
        datasetCount={data.count}
        isFetching={isFetching}
        error={error?.message}
        className="text-center text-pretty max-md:hidden"
      />
      <Button variant="secondary" onClick={clearFilters}>
        Clear search <Undo2Icon />
      </Button>
    </div>
  );
}
