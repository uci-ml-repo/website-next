"use client";

import { CommandEmpty } from "cmdk";
import { Check } from "lucide-react";
import { matchSorter } from "match-sorter";
import * as React from "react";
import { useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";

import { Main } from "@/components/layout/Main";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function ComboboxDemo() {
  const strings = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  const [values, setValues] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const matches = useMemo(
    () => matchSorter(strings, searchValue),
    [searchValue, strings],
  );

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const s = matches[index];
    return (
      <CommandItem
        key={s}
        value={s}
        className="cursor-pointer gap-0.5 pl-1.5"
        onSelect={(value) => {
          if (!values.includes(value)) {
            setValues((prev) => [...prev, value]);
          } else {
            setValues((prev) => prev.filter((v) => v !== value));
          }
        }}
        style={style}
      >
        <Check className={cn("size-3.5", { invisible: !values.includes(s) })} />
        {s}
      </CommandItem>
    );
  };

  return (
    <div className="w-80">
      <Command className="overflow-visible">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Input
            placeholder="Search framework..."
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setPopoverOpen(true)}
          />
          <PopoverTrigger tabIndex={-1} />
          <PopoverContent
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="p-0 w-[--radix-popover-trigger-width]"
          >
            <CommandList>
              <CommandEmpty className="py-2 px-4 text-muted-foreground">
                No results found
              </CommandEmpty>
              {!!matches.length && (
                <List
                  height={300}
                  itemCount={matches.length}
                  itemSize={28}
                  overscanCount={10}
                  width="100%"
                >
                  {Row}
                </List>
              )}
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  );
}

export default function Test() {
  return (
    <Main>
      <ComboboxDemo />
    </Main>
  );
}
