import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { DatasetFiltersMobile } from "@/components/datasets/DatasetFiltersMobile";
import {
  DatasetSearchOrderBy,
  orderByOptions,
} from "@/components/datasets/DatasetSearchOrderBy";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { InputClearable } from "@/components/ui/input-clearable";
import type { DatasetQuery } from "@/server/schema/dataset";

export function DatasetSearchInput() {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const { inputValue, setInputValue, searchValue, handleChange } =
    useDebouncedSearch({ defaultValue: filters.search });

  const [autoOrder, setAutoOrder] = useState(true);
  const [localOrder, setLocalOrder] = useState<string>(
    filters.search
      ? "relevance"
      : Object.keys(filters.order || {})[0] || "viewCount",
  );

  const handleOrderChange = (newOrder: string) => {
    if (localOrder !== newOrder) {
      setLocalOrder(newOrder);
      setAutoOrder(false);
    }
  };

  useEffect(() => {
    if (searchValue) {
      if (autoOrder && localOrder !== "relevance") {
        setLocalOrder("relevance");
      }
    } else {
      setAutoOrder(true);
      if (localOrder === "relevance") {
        setLocalOrder("viewCount");
      }
    }
  }, [searchValue, autoOrder, localOrder]);

  useEffect(() => {
    const order =
      localOrder === "relevance"
        ? undefined
        : { [localOrder]: orderByOptions[localOrder].sort };

    setFilters({
      search: searchValue,
      order: localOrder !== "viewCount" ? order : undefined,
      cursor: 0,
    });
  }, [localOrder, searchValue, setFilters]);

  return (
    <div className="flex w-full flex-col items-end justify-between gap-4 md:flex-row">
      <InputClearable
        placeholder="Search datasets"
        icon={SearchIcon}
        value={inputValue}
        setValue={setInputValue}
        onChange={handleChange}
        containerClassName="w-full"
        aria-label="Search datasets"
      />
      <div className="flex items-end max-lg:justify-between max-md:w-full">
        <div className="mr-4 lg:hidden">
          <DatasetFiltersMobile />
        </div>
        <div>
          <div className="mb-1 text-sm text-muted-foreground max-md:hidden">
            Sort By
          </div>
          <DatasetSearchOrderBy
            value={localOrder}
            onChange={handleOrderChange}
            searchActive={!!inputValue}
          />
        </div>
      </div>
    </div>
  );
}
