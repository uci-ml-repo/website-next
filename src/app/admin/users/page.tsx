"use client";

import { ChevronDownIcon, SearchIcon, Undo2Icon } from "lucide-react";
import React, { useState } from "react";

import { UserPreview } from "@/components/admin/users/UserPreview";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useInfinitePagination } from "@/components/hooks/use-infinite-pagination";
import { BackToTop } from "@/components/ui/back-to-top";
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
import type { Enums } from "@/db/lib/enums";
import { trpc } from "@/server/trpc/query/client";

export default function Page() {
  const [roleFilter, setRoleFilter] = useState<Enums.UserRole | "any">();

  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.user.find.byQuery.useInfiniteQuery(
      {
        search: searchValue,
        role: roleFilter === "any" ? undefined : roleFilter,
        limit: 15,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const users = data?.pages.flatMap((page) => page.users) || [];

  const { triggerFetchNextPage } = useInfinitePagination({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-full">
          <InputClearable
            icon={SearchIcon}
            placeholder="Search by name or email"
            aria-label="Search users"
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 max-sm:w-full">
          <div className="text-nowrap text-sm text-muted-foreground max-xxs:hidden">
            Sort by:
          </div>
          <Select
            value={roleFilter || "any"}
            onValueChange={(value) =>
              setRoleFilter(value as Enums.UserRole | "any")
            }
          >
            <SelectTrigger className="w-32" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="librarian">Librarian</SelectItem>
              <SelectItem value="curator">Curator</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No users found</div>
          <Button variant="secondary" onClick={clearSearch}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        <div className="w-full">
          {searchValue && data && (
            <div className="text-lg text-muted-foreground">
              Found {users.length}
              {hasNextPage && "+"} {users.length === 1 ? "user" : "users"} for '
              {searchValue}'
            </div>
          )}
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <UserPreview user={user} />
              <hr />
            </React.Fragment>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="flex items-center justify-between">
        {hasNextPage && !isFetchingNextPage && (
          <Button onClick={triggerFetchNextPage} variant="blue">
            <ChevronDownIcon /> View more
          </Button>
        )}
        {users.length > 10 && <BackToTop />}
      </div>
    </div>
  );
}
