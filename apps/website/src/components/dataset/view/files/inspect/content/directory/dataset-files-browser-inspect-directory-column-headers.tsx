import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Dispatch, HTMLAttributes, SetStateAction } from "react";
import { useCallback } from "react";

import { cn } from "@/lib/util/cn";

export type FileSort = {
  orderBy: "name" | "size";
  order: "asc" | "desc";
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  sort: FileSort;
  setSort: Dispatch<SetStateAction<FileSort>>;
}

type SortField = FileSort["orderBy"];

export function DatasetFilesBrowserInspectDirectoryColumnHeaders({
  sort,
  setSort,
  className,
  ...props
}: Props) {
  const toggleSort = useCallback(
    (field: SortField) =>
      setSort((prev) =>
        prev.orderBy === field
          ? { orderBy: field, order: prev.order === "asc" ? "desc" : "asc" }
          : { orderBy: field, order: "asc" },
      ),
    [setSort],
  );

  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center text-xs font-medium [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <HeaderCell
        label="Name"
        field="name"
        active={sort.orderBy === "name"}
        order={sort.order}
        onToggle={toggleSort}
        className="flex-1 justify-start"
      />
      <HeaderCell
        label="Size"
        field="size"
        active={sort.orderBy === "size"}
        order={sort.order}
        onToggle={toggleSort}
        className="w-[6.75rem] justify-start px-3"
      />
    </div>
  );
}

function HeaderCell({
  label,
  field,
  active,
  order,
  onToggle,
  className,
}: {
  label: string;
  field: SortField;
  active: boolean;
  order: FileSort["order"];
  onToggle: (field: SortField) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className={cn(
        "hover:bg-accent focus-visible:bg-accent flex items-center gap-1 rounded-xs px-4 py-1 select-none",
        className,
      )}
      role="columnheader"
      aria-sort={active ? (order === "asc" ? "ascending" : "descending") : "none"}
      aria-label={`Toggle sort by ${label}`}
    >
      <span>{label}</span>
      {active ? order === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon /> : null}
    </button>
  );
}
