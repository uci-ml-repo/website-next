"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";

export function DatasetFilesBrowserInspectFile() {
  const { currentPath } = useDatasetFilesBrowser();

  return (
    <div>
      <div>{currentPath}</div>
    </div>
  );
}
