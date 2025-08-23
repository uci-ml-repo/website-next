"use client";
import { useDebouncedValue } from "@mantine/hooks";
import { UndoIcon } from "@primer/octicons-react";
import Fuse from "fuse.js";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useMemo } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryRowEntry } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-row-entry";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DatasetFilesBrowserInspectSearchResults() {
  const { search, entries, setSearch } = useDatasetFilesBrowser();

  const searchSpace = useMemo(
    () =>
      entries.map((entry) => ({
        basename: entry.basename,
        path: entry.key,
        entry,
      })),
    [entries],
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchSpace, {
        threshold: 0.5,
        keys: [{ name: "basename" }],
      }),
    [searchSpace],
  );

  const [debouncedSearch] = useDebouncedValue(search, 150);

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return undefined;
    return fuse.search(debouncedSearch);
  }, [debouncedSearch, fuse]);

  if (!search) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6">
        <SearchIcon className="text-muted-foreground size-24" />
        <div className="text-center">
          <div className="text-2xl font-semibold">Search All Files</div>
          <div>Begin typing to search</div>
        </div>
        <Button variant="secondary" onClick={() => setSearch(undefined)}>
          Cancel Search
        </Button>
      </div>
    );
  }

  if (searchResults === undefined && search)
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-x-2 py-4">
        <Loader2Icon className="animate-spin" /> Loading...
      </div>
    );

  return searchResults && searchResults.length ? (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 *:*:!block" type="auto" vertical>
        <div className="space-y-1 p-2 pt-0">
          {searchResults.map((match) => (
            <DatasetFilesBrowserInspectDirectoryRowEntry
              key={match.item.entry.key}
              entry={match.item.entry}
              additionalColumn="path"
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center gap-y-3 py-4">
      <div>No results found</div>
      <Button variant="secondary" onClick={() => setSearch("")}>
        <UndoIcon />
        Try another search
      </Button>
    </div>
  );
}
