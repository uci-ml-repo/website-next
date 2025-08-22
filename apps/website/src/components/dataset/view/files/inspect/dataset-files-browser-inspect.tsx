"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectHeader } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-header";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspect({ dataset }: Props) {
  const { currentPath } = useDatasetFilesBrowser();

  return (
    <div className="overflow-hidden">
      <DatasetFilesBrowserInspectHeader dataset={dataset} />
      <div>{JSON.stringify(currentPath)}</div>
    </div>
  );
}
