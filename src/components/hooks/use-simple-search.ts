import { useEffect, useState } from "react";

import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";

export interface UseSimpleSearchOptions<T> {
  defaultFilter?: T | "all";
  defaultLimit?: number;
}

export function useSimpleSearch<T>(options?: UseSimpleSearchOptions<T>) {
  const { defaultFilter = "all", defaultLimit = 10 } = options || {};
  const [filter, setFilter] = useState<T | "all">(defaultFilter);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(defaultLimit);

  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  useEffect(() => {
    setOffset(0);
  }, [inputValue]);

  function clear() {
    clearSearch();
    setOffset(0);
    setFilter(defaultFilter);
  }

  return {
    filter,
    setFilter,
    offset,
    setOffset,
    limit,
    setLimit,
    inputValue,
    setInputValue,
    searchValue,
    handleSearchChange: handleChange,
    clear,
  };
}
