"use client";

import { ClockIcon, HistoryIcon, ShieldIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useAdminUserFilters } from "@/components/hooks/use-admin-user-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserOrder } from "@/server/types/user/request";

export const ADMIN_USER_ORDER: UserOrder = "newest";

const options: { value: UserOrder; label: ReactNode }[] = [
  {
    value: "role",
    label: (
      <>
        <ShieldIcon />
        Role
      </>
    ),
  },
  {
    value: "newest",
    label: (
      <>
        <ClockIcon />
        Newest
      </>
    ),
  },
  {
    value: "oldest",
    label: (
      <>
        <HistoryIcon />
        Oldest
      </>
    ),
  },
];

export function AdminUserFilterOrder() {
  const { order, setOrder } = useAdminUserFilters();

  return (
    <Select
      value={order ?? ADMIN_USER_ORDER}
      onValueChange={(value) => setOrder(value === ADMIN_USER_ORDER ? null : (value as UserOrder))}
    >
      <SelectTrigger className="bg-background mb-0 !h-10 w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
