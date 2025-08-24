"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryFileLogo } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-file-logo";
import { DatasetFilesBrowserInspectDirectoryLogo } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory-logo";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectoryGridEntry({ entry }: { entry: Entry }) {
  const { setCurrentPath } = useDatasetFilesBrowser();

  return (
    <button
      className={cn(
        "flex h-24 w-28 shrink-0 cursor-pointer flex-col items-center gap-y-1 rounded-sm p-1",
        "hover:bg-accent focus-visible:bg-accent",
      )}
      onClick={() => setCurrentPath(entry.key)}
      title={entry.basename}
    >
      {entry.kind === "directory" ? (
        <DatasetFilesBrowserInspectDirectoryLogo height={100} width={100} className="size-12" />
      ) : (
        <DatasetFilesBrowserInspectDirectoryFileLogo
          basename={entry.basename}
          height={100}
          width={100}
          className="size-12"
        />
      )}
      <div className="line-clamp-2 text-sm leading-tight break-all">{entry.basename}</div>
    </button>
  );
}
