"use client";

import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { buildQueryFilters, jsonOrString } from "@/lib/utils";

export function useQueryFilters<T extends Record<string, unknown>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterCount, setFilterCount] = useState<number>(0);

  const filterCountExcept = useCallback(
    ({ except = [] }: { except?: (keyof T)[] } = {}) => {
      return searchParams
        .entries()
        .filter(([key]) => !except.includes(key))
        .toArray().length;
    },
    [searchParams],
  );

  const filters = useMemo(() => {
    const result: Partial<T> = {};
    for (const [key, value] of searchParams.entries()) {
      result[key as keyof T] = jsonOrString(value) as T[keyof T];
    }
    return result;
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const params = buildQueryFilters({ ...filters, ...newFilters });

      const url = `${pathname}?${params.toString()}`;

      router.replace(url, { scroll: false });
      setFilterCount(params.entries().toArray().length);
    },
    [filters, pathname, router],
  );

  const debouncedSetFilters = useMemo(
    () => debounce(setFilters, 175),
    [setFilters],
  );

  const clearFilters = ({ except = [] }: { except?: (keyof T)[] } = {}) => {
    const clearedFilters = (Object.keys(filters) as (keyof T)[]).reduce<
      Partial<T>
    >((acc, key) => {
      acc[key] = except.includes(key as string) ? filters[key] : undefined;
      return acc;
    }, {});
    setFilters(clearedFilters);
  };

  const filterActive = ({ except = [] }: { except?: (keyof T)[] } = {}) =>
    Object.entries(filters).some(
      ([key, value]) => !except.includes(key) && value !== undefined,
    );

  return {
    filters,
    setFilters,
    debouncedSetFilters,
    filterCount,
    filterCountExcept,
    clearFilters,
    filterActive,
  };
}
