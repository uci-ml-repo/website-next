"use client";

import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import DatasetRowSkeleton from "@/components/dataset/preview/DatasetRowSkeleton";
import { Card } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { DATASETS_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetsPreviewSearch() {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
  }, [inputValue]);

  const { data, isPending } = trpc.dataset.find.byQuery.useQuery(
    {
      search: searchValue,
      limit: 4,
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

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    } else if (e.key === "Enter") {
      redirect(DATASETS_ROUTE);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const focusableItems = cardRef.current?.querySelectorAll(
        '[data-focusable="true"]',
      );
      if (focusableItems && focusableItems.length > 0) {
        if (e.key === "ArrowDown") {
          (focusableItems[0] as HTMLElement).focus();
        } else if (e.key === "ArrowUp") {
          (focusableItems[focusableItems.length - 1] as HTMLElement).focus();
        }
      }
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const focusableItems = cardRef.current?.querySelectorAll(
      '[data-focusable="true"]',
    );
    if (!focusableItems) return;
    const itemsArray = Array.from(focusableItems);
    const currentIndex = itemsArray.indexOf(e.currentTarget as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < itemsArray.length) {
        (itemsArray[nextIndex] as HTMLElement).focus();
      } else {
        inputRef.current?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        (itemsArray[prevIndex] as HTMLElement).focus();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div
      className="relative overflow-visible"
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <InputClearable
        id="search"
        ref={inputRef}
        placeholder="Search datasets..."
        variantSize="xl"
        icon={SearchIcon}
        value={inputValue}
        setValue={setInputValue}
        onChange={handleChange}
        onKeyDown={handleInputKeyDown}
        aria-label="Search datasets"
      />
      <Card
        ref={cardRef}
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+1px)] z-10 shadow-2xl",
          { hidden: !isFocused },
        )}
      >
        {inputValue && (
          <Link
            href={DATASETS_ROUTE}
            className="flex w-full items-center space-x-2 truncate rounded-2xl p-4 text-lg font-bold decoration-2 hover:bg-accent hover:underline focus:bg-accent focus:underline"
            data-focusable="true"
            tabIndex={0}
            onKeyDown={handleItemKeyDown}
          >
            <SearchIcon />
            <span>View all results for '{inputValue}'</span>
          </Link>
        )}

        {inputValue ? (
          isPending &&
          Array.from({ length: 1 }).map((_, index) => (
            <DatasetRowSkeleton key={index} />
          ))
        ) : (
          <div className="truncate p-4 text-lg text-muted-foreground">
            Begin typing to search&hellip;
          </div>
        )}

        {data?.datasets && (
          <div className="w-full">
            {data.datasets.map((dataset) => (
              <DatasetRow
                dataset={dataset}
                key={dataset.id}
                data-focusable="true"
                tabIndex={0}
                onKeyDown={handleItemKeyDown}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
