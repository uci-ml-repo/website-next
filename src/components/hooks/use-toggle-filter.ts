import { useCallback } from "react";

import { useQueryFilters } from "@/components/hooks/use-query-filters";
import type { DatasetQuery } from "@/server/schema/dataset";

function toggleFilter<T>(current: T[] | undefined, checked: boolean, value: T): T[] | undefined {
  if (checked) {
    return [...(current ?? []), value];
  }
  const updated = (current ?? []).filter((item) => item !== value);
  return updated.length > 0 ? updated : undefined;
}

export function useToggleFilter<K extends keyof DatasetQuery, T>(filterKey: K) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const toggle = useCallback(
    (checked: boolean, value: T) => {
      const current = filters[filterKey] as T[] | undefined;
      const updated = toggleFilter(current, checked, value);
      setFilters({ [filterKey]: updated, cursor: 0 } as Partial<DatasetQuery>);
    },
    [filters, filterKey, setFilters],
  );

  const clear = useCallback(() => {
    setFilters({ [filterKey]: undefined } as Partial<DatasetQuery>);
  }, [filterKey, setFilters]);

  const isToggled = useCallback(
    (value: T) => {
      return !!(filters[filterKey] as T[] | undefined)?.includes(value);
    },
    [filters, filterKey],
  );

  return { filters, toggle, clear, isToggled };
}
