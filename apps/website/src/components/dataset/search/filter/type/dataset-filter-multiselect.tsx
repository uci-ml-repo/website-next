"use client";

import { CommandEmpty } from "cmdk";
import { without } from "lodash";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { matchSorter } from "match-sorter";
import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { memo, useCallback, useMemo, useRef, useState } from "react";

import { DatasetFilterItem } from "@/components/dataset/search/filter/type/dataset-filter-item";
import { Badge } from "@/components/ui/badge";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { SearchInput } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof DatasetFilterItem> & {
  isLoading?: boolean;
  placeholder?: string;
  values?: string[] | Map<string, ReactNode>;
  selectedValues?: string[];
  setSelectedValues: (value: string[] | ((old: string[] | null) => string[] | null) | null) => void;
};

export function DatasetFilterMultiselect({
  values,
  selectedValues,
  setSelectedValues,
  isLoading,
  placeholder,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const _values = useMemo(
    () => (values ? (values instanceof Map ? Object.keys(values) : values) : []),
    [values],
  );

  const matches = useMemo(
    () => (searchValue ? matchSorter(_values, searchValue) : _values),
    [searchValue, _values],
  );

  const selectedSet = useMemo(() => new Set(selectedValues ?? []), [selectedValues]);

  const onSelect = useCallback(
    (value: string) => {
      setSelectedValues((prev) => {
        const curr = prev ?? [];
        return selectedSet.has(value) ? curr.filter((v) => v !== value) : [...curr, value];
      });
    },
    [setSelectedValues, selectedSet],
  );

  const Row = memo(function Row({
    value,
    selected,
    right,
    onSelect,
  }: {
    value: string;
    selected: boolean;
    right?: ReactNode;
    onSelect: (v: string) => void;
  }) {
    return (
      <CommandItem value={value} onSelect={() => onSelect(value)} className="cursor-pointer">
        {selected ? <CheckIcon className="shrink-0" /> : <span className="w-4" />}
        {right ? (
          <div className="flex w-full items-center justify-between space-x-2">
            <div className="truncate">{value}</div>
            <div className="shrink-0">{right}</div>
          </div>
        ) : (
          <div className="truncate">{value}</div>
        )}
      </CommandItem>
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
            <motion.button
              key={value}
              layout
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="group max-w-full overflow-hidden rounded-full"
              onClick={() => setSelectedValues((prev) => without(prev, value))}
            >
              <Badge
                variant="blue-ghost"
                className={cn(
                  "max-w-full cursor-pointer",
                  "animate-in fade-in-0 zoom-in-75",
                  "group-hover:border-muted-foreground group-hover:bg-muted group-hover:text-muted-foreground",
                  "group-focus-visible:border-muted-foreground group-focus-visible:bg-muted group-focus-visible:text-muted-foreground",
                )}
              >
                <div className="truncate decoration-2 group-hover:line-through">{value}</div>
              </Badge>
            </motion.button>
          ))}
        </div>
      )}
      <div ref={containerRef}>
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
            <SearchInput
              setValue={setSearchValue}
              value={searchValue}
              placeholder={placeholder}
              size="sm"
              className="rounded-lg"
              wrapperClassName="bg-background"
              onClick={() => setSearchOpen(true)}
              onInput={() => setSearchOpen(true)}
              onBlur={(e) => {
                if (!containerRef.current?.contains(e.relatedTarget)) setSearchOpen(false);
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="w-68 p-0"
            avoidCollisions={false}
            portal={false}
          >
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <Command>
                <CommandList>
                  <CommandEmpty>No keywords found</CommandEmpty>
                  {matches.map((value) => (
                    <Row
                      key={value}
                      value={value}
                      selected={selectedSet.has(value)}
                      right={values instanceof Map ? values.get(value) : undefined}
                      onSelect={onSelect}
                    />
                  ))}
                </CommandList>
              </Command>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </DatasetFilterItem>
  );
}
