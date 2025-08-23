"use client";

import { useInViewport } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import type { FileSort } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-column-headers";
import { DatasetFilesBrowserInspectDirectoryColumnHeaders } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-column-headers";
import { DatasetFilesBrowserInspectDirectoryGridEntry } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-grid-entry";
import { DatasetFilesBrowserInspectDirectoryRowEntry } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-row-entry";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectory() {
  const { currentPath, entryMap, directoryViewType } = useDatasetFilesBrowser();
  const { ref: topRef, inViewport: isAtTop } = useInViewport();

  const [sort, setSort] = useState<FileSort>({ orderBy: "name", order: "asc" });

  useEffect(() => {
    if (directoryViewType === "grid") {
      setSort({ orderBy: "name", order: "asc" });
    }
  }, [directoryViewType]);

  const entries = useMemo(() => {
    const size = (entry: Entry) => {
      if (entry.kind === "file") return entry.size ?? 0;
      return (entryMap[entry.key] as Entry[]).length;
    };

    const compareName = (a: Entry, b: Entry) =>
      a.basename.localeCompare(b.basename, undefined, {
        numeric: true,
        sensitivity: "base",
      });

    const compareSize = (a: Entry, b: Entry) => (size(a) ?? 0) - (size(b) ?? 0);

    return (entryMap[currentPath] as Entry[]).toSorted((a, b) => {
      const aIsDir = a.kind === "directory";
      const bIsDir = b.kind === "directory";

      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;

      let compare = 0;
      if (sort.orderBy === "name") {
        compare = compareName(a, b);
      } else if (sort.orderBy === "size") {
        compare = compareSize(a, b);
      }

      compare = sort.order === "asc" ? compare : -compare;
      if (compare === 0) compare = compareName(a, b);

      return compare;
    });
  }, [entryMap, currentPath, sort.orderBy, sort.order]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {directoryViewType === "rows" && (
        <DatasetFilesBrowserInspectDirectoryColumnHeaders
          className={cn(!isAtTop && "border-b")}
          sort={sort}
          setSort={setSort}
        />
      )}
      <ScrollArea className="min-h-0 flex-1 *:*:!block" type="auto">
        <div ref={topRef} />
        <div
          className={cn(
            "space-y-1 p-2 pt-0",
            directoryViewType === "grid" &&
              "grid grid-cols-[repeat(auto-fill,minmax(7rem,auto))] gap-2",
          )}
        >
          {entries.map((entry) =>
            directoryViewType === "rows" ? (
              <DatasetFilesBrowserInspectDirectoryRowEntry key={entry.key} entry={entry} />
            ) : (
              <DatasetFilesBrowserInspectDirectoryGridEntry key={entry.key} entry={entry} />
            ),
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
