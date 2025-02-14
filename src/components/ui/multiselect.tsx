import { CommandEmpty } from "cmdk";
import { Check, XIcon } from "lucide-react";
import { matchSorter } from "match-sorter";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { FixedSizeList as List } from "react-window";

import { Badge } from "@/components/ui/badge";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Multiselect({
  placeholder,
  values,
  selectedValues,
  setSelectedValues,
  itemSize = 28,
  height = 240,
  overscanCount = 5,
}: {
  placeholder?: string;
  values: string[] | Map<string, string | number>;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  itemSize?: number;
  height?: number;
  overscanCount?: number;
}) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const listRef = React.useRef<List>(null);

  const _values = values instanceof Map ? values.keys().toArray() : values;

  const matches = useMemo(
    () => (searchValue ? matchSorter(_values, searchValue) : _values),
    [searchValue, _values],
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [searchValue]);

  const removeValue = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div>
      <div
        className={cn("flex flex-wrap gap-1.5", {
          "mb-2": selectedValues.length,
        })}
      >
        {selectedValues.map((value) => (
          <motion.button
            key={value}
            layout
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="group rounded-full"
            onClick={() => removeValue(value)}
          >
            <Badge
              variant="blue"
              className={cn(
                "cursor-pointer space-x-0.5 pr-1",
                "animate-in fade-in-0 zoom-in-50",
                "group-hover:border-destructive group-hover:bg-destructive/10 group-hover:text-destructive group-focus:border-destructive group-focus:bg-destructive/10 group-focus:text-destructive",
              )}
            >
              <span>{value}</span>
              <XIcon className="size-3 text-muted-foreground group-hover:text-destructive group-focus:text-destructive" />
            </Badge>
          </motion.button>
        ))}
      </div>

      <Command className="overflow-visible">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Input
            variantSize="sm"
            placeholder={placeholder}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setPopoverOpen(true)}
          />
          <PopoverTrigger tabIndex={-1} className="-mt-[1px] h-[1px]" />
          <PopoverContent
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="p-0 w-[--radix-popover-trigger-width]"
          >
            <CommandList>
              <CommandEmpty className="py-2 px-4 text-muted-foreground text-sm">
                No results found
              </CommandEmpty>
              {!!matches.length && (
                <List
                  ref={listRef}
                  height={height}
                  itemCount={matches.length}
                  itemSize={itemSize}
                  overscanCount={overscanCount}
                  width="100%"
                  style={{ maxHeight: matches.length * itemSize }}
                >
                  {({ index, style }) => {
                    const value = matches[index];
                    return (
                      <CommandItem
                        key={value}
                        value={value}
                        className="cursor-pointer gap-0.5 pl-1.5"
                        onSelect={(selectValue) => {
                          if (!selectedValues.includes(selectValue)) {
                            setSelectedValues((prev) => [...prev, selectValue]);
                          } else {
                            setSelectedValues((prev) =>
                              prev.filter((v) => v !== selectValue),
                            );
                          }
                        }}
                        style={style}
                      >
                        <Check
                          className={cn("size-3.5", {
                            invisible: !selectedValues.includes(value),
                          })}
                        />
                        {values instanceof Map ? (
                          <span className="flex justify-between min-w-0 w-full space-x-1">
                            <span className="truncate">{value}</span>
                            <span className="text-muted-foreground">
                              ({values.get(value)})
                            </span>
                          </span>
                        ) : (
                          <span className="truncate">{value}</span>
                        )}
                      </CommandItem>
                    );
                  }}
                </List>
              )}
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  );
}
