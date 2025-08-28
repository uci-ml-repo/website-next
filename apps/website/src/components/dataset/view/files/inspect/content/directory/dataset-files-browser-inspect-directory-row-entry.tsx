"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryLogo } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-logo";
import { DatasetFilesBrowserInspectFileLogo } from "@/components/dataset/view/files/inspect/content/file/dataset-files-browser-inspect-file-logo";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

interface Props {
  entry: Entry;
  additionalColumn?: "size" | "path";
}

export function DatasetFilesBrowserInspectDirectoryRowEntry({
  entry,
  additionalColumn = "size",
}: Props) {
  const { setCurrentPath, directoryMap } = useDatasetFilesBrowser();

  return (
    <button
      className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-x-2 rounded-xs px-2 py-1 text-sm text-nowrap"
      onClick={() => setCurrentPath(entry.key)}
    >
      {entry.kind === "directory" ? (
        <DatasetFilesBrowserInspectDirectoryLogo height={100} width={100} className="size-4.5" />
      ) : (
        <DatasetFilesBrowserInspectFileLogo
          basename={entry.basename}
          height={100}
          width={100}
          className="size-4.5"
        />
      )}
      <span
        className={cn(
          "min-w-0 text-left",
          additionalColumn === "size" && "flex-1 basis-0 truncate",
        )}
      >
        {entry.basename}
      </span>
      {additionalColumn === "size" ? (
        <span className="text-muted-foreground w-20 text-left">
          {entry.kind === "directory"
            ? `${directoryMap[entry.key].length} items`
            : abbreviateFileSize(entry.size ?? 0)}
        </span>
      ) : (
        <span className="text-muted-foreground ml-2 min-w-0 flex-1 basis-0 truncate text-right">
          {entry.key.substring(0, entry.key.length - entry.basename.length)}
        </span>
      )}
    </button>
  );
}
