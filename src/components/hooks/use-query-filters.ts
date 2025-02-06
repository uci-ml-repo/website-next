"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { jsonOrString } from "@/lib/utils";

export function buildQueryFilters(filters: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    }
  });

  return params;
}

export function useQueryFilters<T extends Record<string, unknown>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    },
    [filters, pathname, router],
  );

  return { filters, setFilters };
}
