"use client";

import { useState } from "react";

import { SearchInput } from "@/components/ui/input";

export function DatasetQuickSearch() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <SearchInput
        placeholder="Search datasets"
        size="lg"
        value={searchValue}
        setValue={setSearchValue}
      />
      {searchValue}
    </div>
  );
}
