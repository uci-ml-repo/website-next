"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import type { FileEntry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectFileInfoSize() {
  const { currentPath, entryMap } = useDatasetFilesBrowser();

  const currentEntry = entryMap[currentPath] as FileEntry;

  return (
    <div
      className="bg-accent-strong/90 absolute right-0 bottom-0 mr-2.5 flex max-w-[80%] items-center space-x-1 rounded-t-sm border-x border-t p-1 text-sm"
      data-slot="file-info"
    >
      <span className="flex-1 truncate overflow-hidden">{currentEntry.basename}</span>
      {currentEntry.size && (
        <span className="text-muted-foreground shrink-0">
          ({abbreviateFileSize(currentEntry.size)})
        </span>
      )}
    </div>
  );
}
