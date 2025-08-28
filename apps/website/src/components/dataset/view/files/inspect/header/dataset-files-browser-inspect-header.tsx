"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryViewType } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-directory-view-type";
import { DatasetFilesBrowserInspectDownload } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-download";
import { DatasetFilesBrowserInspectHistory } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-history";
import { DatasetFilesBrowserInspectSearchInput } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-search-input";
import { cn } from "@/lib/util/cn";

import { DatasetFilesBrowserInspectBreadcrumbs } from "./dataset-files-browser-inspect-breadcrumbs";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspectHeader({ dataset }: Props) {
  const { currentEntry, search } = useDatasetFilesBrowser();

  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-center justify-between gap-x-2 p-1",
        currentEntry.kind === "file" && "border-b",
      )}
    >
      <DatasetFilesBrowserInspectHistory />

      {search === undefined ? (
        <DatasetFilesBrowserInspectBreadcrumbs />
      ) : (
        <DatasetFilesBrowserInspectSearchInput />
      )}

      {search === undefined &&
        (currentEntry.kind === "directory" ? (
          <DatasetFilesBrowserInspectDirectoryViewType />
        ) : (
          <DatasetFilesBrowserInspectDownload dataset={dataset} />
        ))}
    </div>
  );
}
