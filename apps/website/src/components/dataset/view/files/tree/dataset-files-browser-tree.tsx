"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserTree() {
  const { entryMap, entries } = useDatasetFilesBrowser();

  const rootEntries = entryMap["/"] as Entry[];

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <div className="bg-accent flex items-end gap-x-2 border-b p-2">
        <div>Files</div>
        <div className="text-muted-foreground text-sm">({entries.length} items)</div>
      </div>
      <div className="size-full min-h-0 overflow-auto p-1">
        {rootEntries.map((entry) => (
          <DatasetFilesBrowserTreeEntry key={entry.key} entry={entry} level={1} />
        ))}
      </div>
    </div>
  );
}
