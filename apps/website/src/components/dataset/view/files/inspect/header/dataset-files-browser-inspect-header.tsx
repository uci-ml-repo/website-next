"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectoryViewType } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-directory-view-type";
import { DatasetFilesBrowserInspectDownload } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-download";
import { DatasetFilesBrowserInspectHistory } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-history";

import { DatasetFilesBrowserInspectBreadcrumbs } from "./dataset-files-browser-inspect-breadcrumbs";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspectHeader({ dataset }: Props) {
  const { currentEntryType } = useDatasetFilesBrowser();

  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-x-2 border-b p-1">
      <DatasetFilesBrowserInspectHistory />
      <DatasetFilesBrowserInspectBreadcrumbs />
      {currentEntryType === "directory" ? (
        <DatasetFilesBrowserInspectDirectoryViewType />
      ) : (
        <DatasetFilesBrowserInspectDownload dataset={dataset} />
      )}
    </div>
  );
}
