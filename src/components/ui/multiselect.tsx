import * as Ariakit from "@ariakit/react";
import { CheckIcon, XIcon } from "lucide-react";
import { matchSorter } from "match-sorter";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FixedSizeList as List } from "react-window";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Multiselect({
  placeholder,
  values,
  selectedValues,
  setSelectedValues,
  rowHeight = 30,
  maxListHeight = 240,
}: {
  placeholder?: string;
  values: string[] | Map<string, string | number>;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  rowHeight?: number;
  maxListHeight?: number;
  rowRenderer?: () => React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const listRef = useRef<List>(null);

  const _values = values instanceof Map ? values.keys().toArray() : values;

  const matches = useMemo(
    () => matchSorter(_values, searchValue),
    [_values, searchValue],
  );

  const listHeight = Math.min(matches.length * rowHeight, maxListHeight);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [searchValue]);

  const removeValue = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  return (
    <Ariakit.ComboboxProvider
      open={comboboxOpen}
      setOpen={setComboboxOpen}
      selectedValue={selectedValues}
      setSelectedValue={setSelectedValues}
      setValue={(value) => {
        startTransition(() => {
          setSearchValue(value);
        });
      }}
    >
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

      <Ariakit.Combobox
        placeholder={placeholder}
        className={cn(
          "flex w-full rounded-full border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        )}
      />

      <Ariakit.ComboboxPopover
        sameWidth
        preventBodyScroll
        gutter={4}
        className="z-40 overflow-y-auto rounded-lg bg-card shadow-lg border"
        aria-busy={isPending}
      >
        {matches.length > 0 ? (
          <List
            height={listHeight}
            itemCount={matches.length}
            itemSize={rowHeight}
            overscanCount={10}
            width="100%"
            ref={listRef}
          >
            {({ index, style }) => {
              const value = searchValue ? matches[index] : _values[index];
              const active = selectedValues.includes(value);

              return (
                <Ariakit.ComboboxItem
                  key={value}
                  value={value}
                  style={style}
                  focusOnHover
                  onClick={() => {
                    if (selectedValues.includes(value)) {
                      removeValue(value);
                    } else {
                      setSelectedValues((prev) => [...prev, value]);
                    }
                  }}
                  className={cn(
                    "group flex cursor-pointer items-center space-x-0.5 p-1 pr-1.5",
                    "hover:bg-accent focus:bg-accent overflow-hidden w-full",
                    "data-[active-item]:bg-accent",
                  )}
                >
                  <CheckIcon
                    className={cn("shrink-0 size-4", {
                      invisible: !active,
                    })}
                  />
                  {values instanceof Map ? (
                    <span className="flex justify-between min-w-0 w-full space-x-2">
                      <span className="truncate">{value}</span>
                      <span className="text-muted-foreground">
                        ({values.get(value)})
                      </span>
                    </span>
                  ) : (
                    <span className="truncate">{value}</span>
                  )}
                </Ariakit.ComboboxItem>
              );
            }}
          </List>
        ) : (
          <div className="p-2 text-muted-foreground">No results found</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
