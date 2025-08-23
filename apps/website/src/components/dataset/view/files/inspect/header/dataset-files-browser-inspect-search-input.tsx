"use client";

import { useEffect, useRef } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { SearchInput } from "@/components/ui/input";

export function DatasetFilesBrowserInspectSearchInput() {
  const { search, setSearch } = useDatasetFilesBrowser();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search === "") {
      inputRef.current?.focus();
    }
  }, [search]);

  return (
    <SearchInput
      value={search}
      setValue={setSearch}
      className="bg-accent/80 w-full [&_input]:rounded-sm [&_input]:shadow-none"
      size="sm"
      inputProps={{
        autoFocus: true,
        onBlur: (e) => {
          if (!search) e.target.focus();
        },
        ref: inputRef,
      }}
      onClear={() => setSearch(undefined)}
      alwaysShowClear
    />
  );
}
