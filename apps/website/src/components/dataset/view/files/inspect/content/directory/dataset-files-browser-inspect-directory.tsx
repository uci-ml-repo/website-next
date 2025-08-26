"use client";

import { useEffect, useMemo, useState } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import type { FileSort } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-column-headers";
import { DatasetFilesBrowserInspectDirectoryColumnHeaders } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-column-headers";
import { DatasetFilesBrowserInspectDirectoryGridEntry } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-grid-entry";
import { DatasetFilesBrowserInspectDirectoryRowEntry } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-row-entry";
import { useScrollEdges } from "@/components/hooks/use-scroll-edges";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectory() {
  const { currentPath, directoryMap, directoryViewType } = useDatasetFilesBrowser();
  const { ref, edges } = useScrollEdges<HTMLDivElement>();

  const [sort, setSort] = useState<FileSort>({ orderBy: "name", order: "asc" });

  useEffect(() => {
    if (directoryViewType === "grid") {
      setSort({ orderBy: "name", order: "asc" });
    }
  }, [directoryViewType]);

  const entries = useMemo(() => {
    const size = (entry: Entry) => {
      if (entry.kind === "file") return entry.size ?? 0;
      return directoryMap[entry.key].length;
    };

    const compareName = (a: Entry, b: Entry) =>
      a.basename.localeCompare(b.basename, undefined, {
        numeric: true,
        sensitivity: "base",
      });

    const compareSize = (a: Entry, b: Entry) => size(a) - size(b);

    return directoryMap[currentPath].toSorted((a, b) => {
      const aIsDir = a.kind === "directory";
      const bIsDir = b.kind === "directory";

      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;

      let compare: number;
      if (sort.orderBy === "name") {
        compare = compareName(a, b);
      } else {
        compare = compareSize(a, b);
      }

      compare = sort.order === "asc" ? compare : -compare;
      if (compare === 0) compare = compareName(a, b);

      return compare;
    });
  }, [directoryMap, currentPath, sort.orderBy, sort.order]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {directoryViewType === "rows" && (
        <DatasetFilesBrowserInspectDirectoryColumnHeaders
          className={cn(!edges.atTop && "border-b")}
          sort={sort}
          setSort={setSort}
        />
      )}
      <ScrollArea className="min-h-0 flex-1 *:*:!block" type="auto" viewportRef={ref} vertical>
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
      </ScrollArea>
    </div>
  );
}
