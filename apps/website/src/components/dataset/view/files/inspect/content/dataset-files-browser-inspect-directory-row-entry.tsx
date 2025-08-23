"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryLogo } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-directory-logo";
import { DatasetFilesBrowserInspectFileLogo } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-file-logo";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserInspectDirectoryRowEntry({ entry }: { entry: Entry }) {
  const { currentPath, setCurrentPath } = useDatasetFilesBrowser();

  const relativeName =
    currentPath === "/" ? entry.key : entry.key.substring(currentPath.length + 1);

  return (
    <button
      className="hover:bg-accent focus-visible:bg-accent flex w-full cursor-pointer items-center gap-x-2 rounded-xs px-2 py-1 text-sm"
      onClick={() => setCurrentPath(entry.key)}
    >
      {entry.kind === "directory" ? (
        <DatasetFilesBrowserInspectDirectoryLogo height={100} width={100} className="size-4.5" />
      ) : (
        <DatasetFilesBrowserInspectFileLogo
          fileName={relativeName}
          height={100}
          width={100}
          className="size-4.5"
        />
      )}
      {relativeName}
    </button>
  );
}
