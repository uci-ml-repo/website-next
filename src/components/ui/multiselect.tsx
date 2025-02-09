import * as Ariakit from "@ariakit/react";
import { XIcon } from "lucide-react";
import { matchSorter } from "match-sorter";
import { motion } from "motion/react";
import { useMemo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Multiselect({
  placeholder,
  values,
  selectedValues,
  setSelectedValues,
}: {
  placeholder?: string;
  values: string[];
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");

  const removeValue = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  const matches = useMemo(
    () => matchSorter(values, searchValue),
    [searchValue, values],
  );

  return (
    <Ariakit.ComboboxProvider
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
        gutter={4}
        className="z-50 max-h-60 snap-y overflow-y-auto rounded-lg bg-card shadow"
        aria-busy={isPending}
      >
        {matches.map((value) => (
          <Ariakit.ComboboxItem
            key={value}
            value={value}
            focusOnHover
            className={cn(
              "flex cursor-pointer snap-start items-center space-x-0.5 p-1",
              "data-[active-item]:bg-accent",
            )}
          >
            <Ariakit.ComboboxItemCheck />
            <span>{value}</span>
          </Ariakit.ComboboxItem>
        ))}
        {!matches.length && (
          <div className="p-2 text-muted-foreground">No results found</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
