"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectFileLogo } from "@/components/dataset/view/files/inspect/content/file/dataset-files-browser-inspect-file-logo";

export function DatasetFilesBrowserInspectFileNoDisplay() {
  const { currentEntry } = useDatasetFilesBrowser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
      <DatasetFilesBrowserInspectFileLogo
        basename={currentEntry.basename}
        width={100}
        height={100}
        className="size-24"
      />
      <div className="text-lg">{currentEntry.basename}</div>
      <div className="text-muted-foreground text-center text-sm">
        This file type is not viewable
      </div>
    </div>
  );
}
