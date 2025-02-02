"use client";

import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetRowSkeleton from "@/components/dataset/preview/DatasetRowSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetSearchInput() {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const debouncedSetSearchValue = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, 100),
    [setSearchValue],
  );

  const { data, isPending } = trpc.dataset.find.byQuery.useQuery(
    {
      search: searchValue,
      limit: 5,
    },
    {
      enabled: searchValue.length > 0,
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSetSearchValue(newValue);
  };

  return (
    <div className="relative">
      <InputClearable
        id="search"
        placeholder="Search datasets"
        variantSize="xl"
        icon={SearchIcon}
        value={inputValue}
        setValue={setInputValue}
        onChange={handleChange}
        onFocus={() => setInputFocused(true)}
        aria-label="Search datasets"
      />
      {inputFocused && (
        <Card
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 right-0 top-[calc(100%+1px)] z-10 shadow-2xl"
        >
          <CardContent className="p-0">
            {inputValue && (
              <Link
                className="flex items-center space-x-2 truncate rounded-2xl p-4 text-lg font-bold decoration-2 hover:bg-accent hover:underline"
                href="#"
              >
                <SearchIcon />
                <span>Search '{inputValue}'</span>
              </Link>
            )}
            {inputValue ? (
              isPending &&
              Array.from({ length: 1 }).map((_, index) => (
                <DatasetRowSkeleton key={index} />
              ))
            ) : (
              <div className="truncate p-4 text-lg text-muted-foreground">
                Type to search&hellip;
              </div>
            )}
            {data && data.datasets.length > 0 && (
              <div className="w-full">
                {data.datasets.map((dataset) => (
                  <DatasetRow key={dataset.id} dataset={dataset} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
