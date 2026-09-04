"use client";

import { useAdminUserFilters } from "@/components/hooks/use-admin-user-filters";
import { SearchInput } from "@/components/ui/input";

import { AdminUserFiltersDesktop, AdminUserFiltersMobile } from "./admin-user-filters";
import { AdminUserFilterOrder } from "./admin-user-order";
import { AdminUserTable } from "./admin-user-table";

export function AdminUsers() {
  const { search, setSearch } = useAdminUserFilters();

  return (
    <div className="flex space-x-6">
      <AdminUserFiltersDesktop className="max-xl:hidden" />
      <div className="flex grow flex-col">
        <div className="space-y-2">
          <div className="flex items-end gap-3 max-md:flex-col">
            <div className="w-full">
              <SearchInput
                placeholder="Search users"
                size="md"
                value={search ?? ""}
                setValue={setSearch}
                className="bg-background"
                inputProps={{ "aria-label": "Search users by name or email" }}
              />
            </div>
            <div className="flex items-end justify-between gap-x-3 max-md:w-full">
              <AdminUserFiltersMobile />
              <div className="flex flex-col gap-1 max-md:flex-row max-md:items-center">
                <div className="text-muted-foreground max-2xs:hidden">Order by:</div>
                <AdminUserFilterOrder />
              </div>
            </div>
          </div>

          <AdminUserTable />
        </div>
      </div>
    </div>
  );
}
