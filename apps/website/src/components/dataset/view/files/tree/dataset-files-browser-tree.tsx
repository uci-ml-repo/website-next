"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeHeader } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-header";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserTree() {
  const { entryMap } = useDatasetFilesBrowser();

  const rootEntries = entryMap["/"] as Entry[];

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DatasetFilesBrowserTreeHeader />
      <div className="size-full min-h-0 overflow-auto p-1">
        {rootEntries.map((entry) => (
          <DatasetFilesBrowserTreeEntry key={entry.key} entry={entry} level={1} />
        ))}
      </div>
    </div>
  );
}
