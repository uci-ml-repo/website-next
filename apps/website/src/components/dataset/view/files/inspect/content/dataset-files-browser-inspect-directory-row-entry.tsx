"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryLogo } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-directory-logo";
import { DatasetFilesBrowserInspectFileLogo } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-file-logo";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectoryRowEntry({ entry }: { entry: Entry }) {
  const { setCurrentPath, entryMap } = useDatasetFilesBrowser();

  return (
    <button
      className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-x-2 rounded-xs px-2 py-1 text-sm"
      onClick={() => setCurrentPath(entry.key)}
    >
      {entry.kind === "directory" ? (
        <DatasetFilesBrowserInspectDirectoryLogo height={100} width={100} className="size-4.5" />
      ) : (
        <DatasetFilesBrowserInspectFileLogo
          fileName={entry.basename}
          height={100}
          width={100}
          className="size-4.5"
        />
      )}
      <span className="flex flex-1">{entry.basename}</span>
      <span className="text-muted-foreground w-20 text-left">
        {entry.kind === "directory"
          ? `${(entryMap[entry.key] as Entry[]).length} items`
          : abbreviateFileSize(entry.size ?? 0)}
      </span>
    </button>
  );
}
