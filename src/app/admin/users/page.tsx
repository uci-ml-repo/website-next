"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import React, { useState } from "react";

import { UserRow } from "@/components/admin/users/UserRow";
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
import { SmartPagination } from "@/components/ui/smart-pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Enums } from "@/db/lib/enums";
import { formatEnum } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const UserRole = Enums.UserRole;

export default function Page() {
  const [roleFilter, setRoleFilter] = useState<Enums.UserRole | "all">();
  const [limit, setLimit] = useState<number>(25);
  const [offset, setOffset] = useState<number>(0);

  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  const { data, isLoading } = trpc.user.find.byQuery.useQuery({
    search: searchValue,
    role: roleFilter === "all" ? undefined : roleFilter,
    limit,
    cursor: offset,
  });

  return (
    <div className="max-w-full space-y-4 overflow-x-auto">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-full">
          <InputClearable
            icon={SearchIcon}
            placeholder="Search users by email or name"
            aria-label="Search users"
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 max-sm:w-full">
          <div className="text-nowrap text-sm text-muted-foreground max-xxs:hidden">
            Filter Roles:
          </div>
          <Select
            value={roleFilter || "all"}
            onValueChange={(value) =>
              setRoleFilter(value as Enums.UserRole | "all")
            }
          >
            <SelectTrigger className="w-32" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.LIBRARIAN}>Librarian</SelectItem>
              <SelectItem value={UserRole.CURATOR}>Curator</SelectItem>
              <SelectItem value={UserRole.BASIC}>Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : data && data.users.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No users found</div>
          <Button variant="secondary" onClick={clearSearch}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        data && (
          <div className="w-full space-y-2">
            {data.users && (
              <div className="text-lg text-muted-foreground">
                Found {data.count} {data.count === 1 ? "user" : "users"}{" "}
                {searchValue && `for '${searchValue}'`}
                {roleFilter &&
                  roleFilter !== "all" &&
                  ` with role '${formatEnum(roleFilter)}'`}
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-sm:hidden">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-32">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((user) => (
                  <UserRow user={user} key={user.id} />
                ))}
              </TableBody>
            </Table>
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
