"use client";

import { DatasetFileBrowserInspectDownload } from "@/components/dataset/view/files/inspect/dataset-file-browser-inspect-download";
import { DatasetFileBrowserInspectHistory } from "@/components/dataset/view/files/inspect/dataset-file-browser-inspect-history";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspectHeader({ dataset }: Props) {
  return (
    <div className="flex h-10 items-center justify-between border-b px-1">
      <DatasetFileBrowserInspectHistory />
      <DatasetFileBrowserInspectDownload dataset={dataset} />
    </div>
  );
}
