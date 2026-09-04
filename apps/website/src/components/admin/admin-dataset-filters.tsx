"use client";

import { Enums } from "@packages/db/enum";
import { without } from "lodash";
import type { HTMLAttributes } from "react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataset-search-filters";
import { Card } from "@/components/ui/card";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { FiltersSheet } from "@/components/ui/filters-sheet";
import { cn } from "@/lib/util/cn";
import { formatEnum } from "@/server/types/util/enum";

const ADMIN_DATASET_STATUSES = [Enums.ApprovalStatus.PENDING, Enums.ApprovalStatus.REJECTED];
const DEFAULT_ADMIN_STATUS = [Enums.ApprovalStatus.PENDING];

function AdminDatasetStatusCheckboxes({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  const { status, setStatus } = useDatasetSearchFilters();
  const selectedStatuses = status ?? DEFAULT_ADMIN_STATUS;

  function addStatus(value: Enums.ApprovalStatus) {
    const next = [...selectedStatuses, value];
    setStatus(isDefaultAdminStatus(next) ? null : next);
  }

  function removeStatus(value: Enums.ApprovalStatus) {
    if (selectedStatuses.length <= 1) return;
    const next = without(selectedStatuses, value);
    setStatus(isDefaultAdminStatus(next) ? null : next);
  }

  return (
    <ul className={className} {...props}>
      {ADMIN_DATASET_STATUSES.map((approvalStatus) => {
        const checked = selectedStatuses.includes(approvalStatus);
        const enumString = formatEnum(approvalStatus);

        return (
          <li key={approvalStatus} className="py-1 first:pt-0 last:pb-0">
            <CheckboxLabeled
              checked={checked}
              onCheckedChange={(checked) =>
                checked ? addStatus(approvalStatus) : removeStatus(approvalStatus)
              }
              role="button"
              aria-label={`${checked ? "Disable" : "Enable"} ${enumString} status filter`}
            >
              {enumString}
            </CheckboxLabeled>
          </li>
        );
      })}
    </ul>
  );
}

function isDefaultAdminStatus(statuses: Enums.ApprovalStatus[]) {
  return statuses.length === 1 && statuses[0] === Enums.ApprovalStatus.PENDING;
}

export function AdminDatasetFiltersDesktop({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="text-lg">Filters</div>
      <Card className="bg-card/50 w-72 p-4">
        <AdminDatasetStatusCheckboxes />
      </Card>
    </div>
  );
}

export function AdminDatasetFiltersMobile() {
  const { status } = useDatasetSearchFilters();
  const selectedStatuses = status ?? DEFAULT_ADMIN_STATUS;
  const filterCount = isDefaultAdminStatus(selectedStatuses) ? 0 : 1;

  return (
    <FiltersSheet filterCount={filterCount} contentClassName="h-auto max-h-[85dvh]">
      <div className="p-4 pt-2">
        <AdminDatasetStatusCheckboxes />
      </div>
    </FiltersSheet>
  );
}
