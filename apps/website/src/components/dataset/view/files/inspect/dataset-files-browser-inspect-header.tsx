"use client";

import { DatasetFilesBrowserInspectBreadcrumbs } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-breadcrumbs";
import { DatasetFilesBrowserInspectDownload } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-download";
import { DatasetFilesBrowserInspectHistory } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-history";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspectHeader({ dataset }: Props) {
  return (
    <div className="flex h-11 items-center justify-between gap-x-2 border-b px-2">
      <DatasetFilesBrowserInspectHistory />
      <DatasetFilesBrowserInspectBreadcrumbs />
      <DatasetFilesBrowserInspectDownload dataset={dataset} />
    </div>
  );
}
