"use client";

import { Undo2Icon } from "lucide-react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { Button } from "@/components/ui/button";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { Spinner } from "@/components/ui/spinner";
import { Enums } from "@/db/lib/enums";
import { trpc } from "@/server/trpc/query/client";
import ApprovalStatus = Enums.ApprovalStatus;
import React from "react";

import { useSimpleSearch } from "@/components/hooks/use-simple-search";
import type { Option } from "@/components/search/SimpleSearch";
import { SimpleSearch } from "@/components/search/SimpleSearch";
import { enumToArray } from "@/lib/utils";

export default function Page() {
  const {
    filter: status,
    setFilter: setStatus,
    offset: cursor,
    setOffset: setCursor,
    limit,
    setLimit,
    inputValue,
    setInputValue,
    searchValue,
    handleSearchChange,
    clear,
  } = useSimpleSearch<ApprovalStatus>({
    defaultFilter: "all",
    defaultLimit: 10,
  });

  const filterOptions: Option[] = [
    { value: "all", label: "All" },
    { value: ApprovalStatus.APPROVED, label: "Approved" },
    { value: ApprovalStatus.PENDING, label: "Pending" },
    { value: ApprovalStatus.DRAFT, label: "Drafts" },
    { value: ApprovalStatus.REJECTED, label: "Rejected" },
  ];

  const { data, isLoading } = trpc.dataset.find.privilegedByQuery.useQuery({
    search: searchValue,
    status: status !== "all" ? [status] : enumToArray(Enums.ApprovalStatus),
    pendingFirst: true,
    limit,
    cursor,
  });

  return (
    <div className="max-w-full space-y-4">
      <SimpleSearch
        searchValue={inputValue}
        setSearchValue={setInputValue}
        handleSearchChange={handleSearchChange}
        searchPlaceholder="Search datasets"
        filterLabel="Status:"
        filterValue={status || "all"}
        onFilterChange={(value) => {
          setStatus(value as ApprovalStatus | "all");
          setCursor(0);
        }}
        filterOptions={filterOptions}
      />
      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : data && data.datasets.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No datasets found</div>
          <Button variant="secondary" onClick={clear}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        data && (
          <div className="space-y-2">
            <div>
              <div className="divide-y">
                {data.datasets.map((dataset) => (
                  <DatasetRow dataset={dataset} displayStatus key={dataset.id} />
                ))}
              </div>
              <hr />
            </div>
            {data.count && (
              <SmartPagination
                totalCount={data.count}
                limit={limit}
                offset={cursor}
                onLimitChange={setLimit}
                onPageChange={setCursor}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}
