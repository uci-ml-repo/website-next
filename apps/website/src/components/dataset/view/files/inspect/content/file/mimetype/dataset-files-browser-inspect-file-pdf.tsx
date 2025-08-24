"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { ROUTES } from "@/lib/routes";

export function DatasetFilesBrowserInspectFilePdf() {
  const { currentPath, dataset } = useDatasetFilesBrowser();

  return (
    <iframe
      src={ROUTES.CDN(String(dataset.id), dataset.slug, currentPath)}
      className="flex flex-1"
    />
  );
}
