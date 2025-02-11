"use client";

import { debounce } from "lodash";
import * as React from "react";

interface UseDebouncedSearchOptions {
  defaultValue?: string;
  debounceDelay?: number;
}

export function useDebouncedSearch({
  defaultValue = "",
  debounceDelay = 175,
}: UseDebouncedSearchOptions = {}) {
  const [inputValue, setInputValue] = React.useState(defaultValue);
  const [searchValue, setSearchValue] = React.useState(defaultValue);

  const debouncedSetSearchValue = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, debounceDelay),
    [debounceDelay],
  );

  React.useEffect(() => {
    if (inputValue === "") {
      setSearchValue("");
    }
  }, [inputValue]);

  const clearSearch = React.useCallback(() => {
    setInputValue("");
    setSearchValue("");
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      debouncedSetSearchValue(newValue);
    },
    [debouncedSetSearchValue],
  );

  React.useEffect(() => {
    return () => {
      debouncedSetSearchValue.cancel();
    };
  }, [debouncedSetSearchValue]);

  return {
    inputValue,
    setInputValue,
    searchValue,
    setSearchValue,
    handleChange,
    clearSearch,
  };
}
