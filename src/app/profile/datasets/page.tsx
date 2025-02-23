"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Enums } from "@/db/lib/enums";
import { trpc } from "@/server/trpc/query/client";

import ApprovalStatus = Enums.ApprovalStatus;
import { SmartPagination } from "@/components/ui/smart-pagination";

export default function Page() {
  const { data: session } = useSession();

  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<
    Enums.ApprovalStatus | "all"
  >();

  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  const { data, isLoading } = trpc.dataset.find.privilegedByQuery.useQuery(
    {
      search: searchValue,
      userId: session?.user?.id,
      status:
        statusFilter && statusFilter !== "all" ? [statusFilter] : undefined,
      limit,
      cursor: offset,
    },
    {
      enabled: !!session?.user,
    },
  );

  useEffect(() => {
    setOffset(0);
  }, [inputValue]);

  function clear() {
    clearSearch();
    setOffset(0);
    setStatusFilter("all");
  }

  return (
    <div className="max-w-full space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-full">
          <InputClearable
            icon={SearchIcon}
            placeholder="Search datasets"
            aria-label="Search datasets"
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 max-sm:w-full">
          <div className="text-nowrap text-sm text-muted-foreground max-xxs:hidden">
            Filter Status:
          </div>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value as ApprovalStatus | "all");
              setOffset(0);
            }}
          >
            <SelectTrigger className="w-32" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={ApprovalStatus.APPROVED}>Approved</SelectItem>
              <SelectItem value={ApprovalStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={ApprovalStatus.DRAFT}>Drafts</SelectItem>
              <SelectItem value={ApprovalStatus.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : data && data.datasets.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No users found</div>
          <Button variant="secondary" onClick={clear}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        data && (
          <div className="space-y-2">
            <div>
              {data.datasets.map((dataset) => (
                <DatasetRow key={dataset.id} dataset={dataset} displayStatus />
              ))}
            </div>
            {data.count && (
              <SmartPagination
                totalCount={data.count}
                limit={limit}
                offset={offset}
                onLimitChange={setLimit}
                onPageChange={setOffset}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}
