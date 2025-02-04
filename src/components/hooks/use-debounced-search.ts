"use client";

import { debounce } from "lodash";
import * as React from "react";

export function useDebouncedSearch(debounceDelay = 175) {
  const [inputValue, setInputValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

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
