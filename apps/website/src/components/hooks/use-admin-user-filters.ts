"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { Enums } from "@packages/db/enum";
import { parseAsInteger, useQueryState } from "nuqs";
import { parseAsArrayOf, parseAsString, parseAsStringEnum } from "nuqs/server";
import { useEffect } from "react";

const parser = {
  search: parseAsString,
  roles: parseAsArrayOf(parseAsStringEnum(Object.values(Enums.UserRole))),
  order: parseAsStringEnum(["newest", "oldest", "role"]),
  limit: parseAsInteger,
  cursor: parseAsInteger,
};

export function useAdminUserFilters() {
  const [search, setSearch] = useQueryState("search", parser.search);
  const [roles, setRoles] = useQueryState("roles", parser.roles);
  const [order, setOrder] = useQueryState("order", parser.order);
  const [limit, setLimit] = useQueryState("limit", parser.limit);
  const [cursor, setCursor] = useQueryState("cursor", parser.cursor);

  const nonSearchFilters = {
    roles: roles?.length ? roles : undefined,
  };

  const filters = {
    search: search?.length ? search : undefined,
    ...nonSearchFilters,
    order: order ?? undefined,
    limit: limit ?? 10,
    cursor: cursor ?? undefined,
  };

  const [debouncedSearch] = useDebouncedValue(search, 300);

  const debouncedFilters = {
    search: debouncedSearch?.length ? debouncedSearch : undefined,
  };

  const nonPaginationFiltersString = JSON.stringify({
    search,
    roles,
    order,
  });

  useEffect(() => {
    setCursor((prev) => (prev ? 0 : null));
  }, [nonPaginationFiltersString, setCursor]);

  const clearFilters = () => {
    setSearch(null);
    setRoles(null);
  };

  const nonSearchFilterCount = Object.values(nonSearchFilters).filter(
    (value) => value !== undefined,
  ).length;
  const anyFilterActive = Object.values({
    search: search?.length ? search : undefined,
    ...nonSearchFilters,
  }).some((value) => value !== undefined);

  return {
    search,
    setSearch,
    roles,
    setRoles,
    order,
    setOrder,
    limit,
    setLimit,
    cursor,
    setCursor,
    filters,
    debouncedFilters,
    clearFilters,
    anyFilterActive,
    nonSearchFilterCount,
    filterCount: nonSearchFilterCount,
  };
}
