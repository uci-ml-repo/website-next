"use client";

import { without } from "lodash";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { matchSorter } from "match-sorter";
import type { ComponentProps, ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { RowComponentProps } from "react-window";
import { List, useListRef } from "react-window";

import { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchPopover } from "@/components/ui/search-popover";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof DatasetFilterItem> & {
  isLoading?: boolean;
  placeholder?: string;
  values?: string[] | Map<string, number>;
  selectedValues?: string[];
  setSelectedValues: (value: string[] | ((old: string[] | null) => string[] | null) | null) => void;
  empty?: ReactNode;
};

export function DatasetFilterMultiselect({
  values,
  selectedValues,
  setSelectedValues,
  isLoading,
  placeholder,
  empty,
  ...props
}: Props) {
  const [searchValue, setSearchValue] = useState<string>("");

  const _values = useMemo(
    () => (values ? (values instanceof Map ? [...values.keys()] : values) : []),
    [values],
  );

  const matches = useMemo(
    () => (searchValue ? matchSorter(_values, searchValue) : _values),
    [searchValue, _values],
  );

  const selectedSet = useMemo(() => new Set(selectedValues ?? []), [selectedValues]);

  const onSelect = useCallback(
    (value: string) => {
      setSelectedValues((prev) =>
        selectedSet.has(value) ? without(prev, value) : [...(prev ?? []), value],
      );
    },
    [setSelectedValues, selectedSet],
  );

  const listRef = useListRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToRow({ index: 0 });
    }
  }, [listRef, searchValue]);

  const Row = memo(function Row({ index, style }: RowComponentProps) {
    const value = matches[index];
    const selected = selectedSet.has(value);
    const count = values instanceof Map ? values.get(value) : undefined;

    return (
      <div style={style}>
        <CommandItem
          value={value}
          onSelect={() => onSelect(value)}
          className="h-7 max-w-full cursor-pointer gap-0.5 rounded-none"
        >
          {selected ? <CheckIcon className="size-4 shrink-0" /> : <span className="w-4 shrink-0" />}
          {count ? (
            <div className="flex min-w-0 grow items-center justify-between space-x-2">
              <div className="truncate">{value}</div>
              <div className="text-muted-foreground min-w-fit shrink-0">{count}</div>
            </div>
          ) : (
            <div className="truncate">{value}</div>
          )}
        </CommandItem>
      </div>
    );
  });

  return (
    <DatasetFilterItem
      badge={selectedValues?.length}
      clearFilter={() => setSelectedValues(null)}
      {...props}
    >
      {selectedValues && (
        <div className="mb-2 flex flex-wrap gap-1">
          {selectedValues.map((value) => (
            <button
              key={value}
              className="group max-w-full overflow-hidden rounded-full"
              onClick={() => setSelectedValues((prev) => without(prev, value))}
            >
              <Badge
                variant="blue-ghost"
                className={cn(
                  "animate-in fade-in-0 zoom-in-75 max-w-full cursor-pointer",
                  "group-hover:border-muted-foreground group-hover:bg-muted group-hover:text-muted-foreground",
                  "group-focus-visible:border-muted-foreground group-focus-visible:bg-muted group-focus-visible:text-muted-foreground",
                )}
              >
                <div className="truncate decoration-2 group-hover:line-through group-focus-visible:line-through">
                  {value}
                </div>
              </Badge>
            </button>
          ))}
        </div>
      )}
      <SearchPopover
        setValue={setSearchValue}
        value={searchValue}
        size="sm"
        placeholder={placeholder}
        empty={
          <div className="text-muted-foreground flex min-h-10 items-center justify-center">
            {empty}
          </div>
        }
        loading={
          isLoading && (
            <div className="flex h-10 items-center justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          )
        }
        className="!bg-background rounded-lg"
        inputProps={{ "aria-label": props["aria-label"] }}
      >
        {!!matches.length && (
          <ScrollArea vertical>
            <List
              rowCount={matches.length}
              rowHeight={28}
              overscanCount={20}
              className="focus-visible:ring-ring/50 h-60"
              rowComponent={Row}
              rowProps={{}}
              listRef={listRef}
            />
          </ScrollArea>
        )}
      </SearchPopover>
    </DatasetFilterItem>
  );
}
