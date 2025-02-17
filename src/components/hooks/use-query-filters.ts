"use client";

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
      return Array.from(searchParams.entries()).filter(
        ([key]) => !except.includes(key),
      ).length;
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
      const currentParams = new URLSearchParams(window.location.search);
      const currentFilters: Partial<T> = {};
      for (const [key, value] of currentParams.entries()) {
        currentFilters[key as keyof T] = jsonOrString(value) as T[keyof T];
      }

      const mergedFilters = { ...currentFilters, ...newFilters };

      console.log(mergedFilters);

      const params = buildQueryFilters(mergedFilters);
      const url = `${pathname}?${params.toString()}`;

      router.push(url, { scroll: false });
      setFilterCount(Array.from(params.entries()).length);
    },
    [pathname, router],
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
    filterCount,
    filterCountExcept,
    clearFilters,
    filterActive,
  };
}
