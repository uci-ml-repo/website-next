"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryGridEntry } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-directory-grid-entry";
import { DatasetFilesBrowserInspectDirectoryRowEntry } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-directory-row-entry";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectory() {
  const { currentPath, entryMap, directoryViewType } = useDatasetFilesBrowser();

  const entries = entryMap[currentPath] as Entry[];

  return (
    <div
      className={cn(
        "p-2",
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
  );
}
