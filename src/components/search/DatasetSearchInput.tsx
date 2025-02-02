"use client";

import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetRowSkeleton from "@/components/dataset/preview/DatasetRowSkeleton";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { InputClearable } from "@/components/ui/input-clearable";
import { trpc } from "@/server/trpc/query/client";

import { Card } from "../ui/card";

export default function DatasetSearchCommand() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const debouncedSetSearchValue = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, 100),
    [],
  );

  useEffect(() => {
    if (inputValue === "") {
      setSearchValue("");
    }
  }, [inputValue, setSearchValue]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  return (
    <Command className="relative overflow-visible">
      <InputClearable
        id="search"
        placeholder="Search datasets..."
        variantSize="xl"
        value={inputValue}
        setValue={setInputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        aria-label="Search datasets"
      />
      <CommandList className={isFocused ? "visible" : "hidden"}>
        <Card className="absolute left-0 right-0 top-[calc(100%+1px)] z-10 shadow-2xl">
          {inputValue && (
            <CommandItem>
              <Link
                tabIndex={-1}
                href="#"
                className="flex w-full items-center space-x-2 truncate rounded-2xl p-4 text-lg font-bold decoration-2 hover:bg-accent hover:underline"
              >
                <SearchIcon />
                <span>Search '{inputValue}'</span>
              </Link>
            </CommandItem>
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

          {data?.datasets && (
            <div className="w-full">
              {data.datasets.map((dataset) => (
                <CommandItem key={dataset.id}>
                  <DatasetRow dataset={dataset} />
                </CommandItem>
              ))}
            </div>
          )}
        </Card>
      </CommandList>
    </Command>
  );
}
