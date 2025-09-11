"use client";

import { SearchIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";

export function DatasetFilesBrowserTreeHeader() {
  const { entries, search, setSearch } = useDatasetFilesBrowser();

  const isSearching = search !== undefined;

  return (
    <div className="@container flex h-11 items-center justify-between gap-x-2 border-b p-2">
      <div className="space-x-2">
        <span>Files</span>
        <span className="text-muted-foreground @max-5xs:hidden text-sm">
          ({entries.length} item{entries.length !== 1 ? "s" : ""})
        </span>
      </div>
      <Button
        variant="ghost"
        onClick={() => setSearch(isSearching ? undefined : "")}
        aria-selected={isSearching}
        className="hover:bg-accent-strong aria-[selected=true]:bg-accent-strong size-8 rounded-sm"
        size="icon"
        aria-label={isSearching ? "Cancel search" : "Search files"}
      >
        <SearchIcon className="size-4" />
      </Button>
    </div>
  );
}
