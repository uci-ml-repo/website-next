"use client";

import { Undo2Icon } from "lucide-react";

import { UserRow } from "@/components/admin/users/UserRow";
import { useSimpleSearch } from "@/components/hooks/use-simple-search";
import type { Option } from "@/components/search/SimpleSearch";
import { SimpleSearch } from "@/components/search/SimpleSearch";
import { Button } from "@/components/ui/button";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Enums } from "@/db/lib/enums";
import { formatEnum } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const UserRole = Enums.UserRole;

export default function Page() {
  const {
    filter: roleFilter,
    setFilter: setRoleFilter,
    offset: cursor,
    setOffset: setCursor,
    limit,
    setLimit,
    inputValue,
    setInputValue,
    searchValue,
    handleSearchChange,
    clear,
  } = useSimpleSearch<Enums.UserRole>({
    defaultFilter: "all",
    defaultLimit: 25,
  });

  const filterOptions: Option[] = [
    { value: "all", label: "All Roles" },
    { value: UserRole.ADMIN, label: "Admin" },
    { value: UserRole.LIBRARIAN, label: "Librarian" },
    { value: UserRole.CURATOR, label: "Curator" },
    { value: UserRole.BASIC, label: "Basic" },
  ];

  const { data, isLoading } = trpc.user.find.byQuery.useQuery({
    search: searchValue,
    role: roleFilter === "all" ? undefined : roleFilter,
    limit,
    cursor,
  });

  return (
    <div className="max-w-full space-y-4">
      <SimpleSearch
        searchValue={inputValue}
        setSearchValue={setInputValue}
        handleSearchChange={handleSearchChange}
        searchPlaceholder="Search users by email or name"
        filterLabel="Filter Roles:"
        filterValue={roleFilter || "all"}
        onFilterChange={(value) => {
          setRoleFilter(value as Enums.UserRole | "all");
          setCursor(0);
        }}
        filterOptions={filterOptions}
      />
      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : data && data.users.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No users found</div>
          <Button variant="secondary" onClick={clear}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        data && (
          <div className="w-full space-y-2">
            {data.users && (
              <div className="text-lg text-muted-foreground">
                Found {data.count.toLocaleString()} {data.count === 1 ? "user" : "users"}{" "}
                {searchValue && `for '${searchValue}'`}
                {roleFilter && roleFilter !== "all" && ` with role '${formatEnum(roleFilter)}'`}
              </div>
            )}
            <div className="w-full overflow-x-auto">
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
