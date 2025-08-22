"use client";

import { SearchIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";

export function DatasetFilesBrowserTreeHeader() {
  const { entries, searching, setSearching } = useDatasetFilesBrowser();

  return (
    <div className="bg-accent @container flex h-10 items-center justify-between gap-x-2 border-b p-2">
      <div className="mt-1 space-x-2">
        <span>Files</span>
        <span className="text-muted-foreground @max-5xs:hidden text-sm">
          ({entries.length} items)
        </span>
      </div>
      <Button
        variant="ghost"
        onClick={() => setSearching((prev) => !prev)}
        aria-selected={searching}
        className="hover:bg-muted-foreground/10 aria-[selected=true]:bg-muted-foreground/10 size-7.5 rounded-sm"
        size="icon"
        aria-label="Search files"
      >
        <SearchIcon className="size-4" />
      </Button>
    </div>
  );
}
