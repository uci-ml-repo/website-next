"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import { without } from "lodash";
import { XIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

import { useAdminUserFilters } from "@/components/hooks/use-admin-user-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { FiltersSheet } from "@/components/ui/filters-sheet";
import { cn } from "@/lib/util/cn";
import { formatEnum } from "@/server/types/util/enum";

function AdminUserRoleCheckboxes() {
  const { roles, setRoles } = useAdminUserFilters();

  function addRole(role: Enums.UserRole) {
    setRoles((prev) => [...(prev ?? []), role]);
  }

  function removeRole(role: Enums.UserRole) {
    setRoles((prev) => {
      const next = without(prev ?? [], role);
      return next.length ? next : null;
    });
  }

  return (
    <ul>
      {enumToArray(Enums.UserRole).map((role) => {
        const checked = !!roles?.includes(role);
        const enumString = formatEnum(role);

        return (
          <li key={role} className="py-1 first:pt-0 last:pb-0">
            <CheckboxLabeled
              checked={checked}
              onCheckedChange={(checked) => (checked ? addRole(role) : removeRole(role))}
              role="button"
              aria-label={`${checked ? "Disable" : "Enable"} ${enumString} role filter`}
            >
              {enumString}
            </CheckboxLabeled>
          </li>
        );
      })}
    </ul>
  );
}

function AdminUserFiltersClear() {
  const { anyFilterActive, clearFilters } = useAdminUserFilters();

  return (
    anyFilterActive && (
      <Button variant="secondary" size="xs" onClick={clearFilters}>
        <XIcon />
        Clear Filters
      </Button>
    )
  );
}

export function AdminUserFiltersDesktop({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="text-lg">Filters</div>
        <AdminUserFiltersClear />
      </div>
      <Card className="bg-card/50 w-72 p-4">
        <AdminUserRoleCheckboxes />
      </Card>
    </div>
  );
}

export function AdminUserFiltersMobile() {
  const { filterCount } = useAdminUserFilters();

  return (
    <FiltersSheet
      filterCount={filterCount}
      headerExtra={<AdminUserFiltersClear />}
      contentClassName="h-auto max-h-[85dvh]"
    >
      <div className="p-4 pt-2">
        <AdminUserRoleCheckboxes />
      </div>
    </FiltersSheet>
  );
}
