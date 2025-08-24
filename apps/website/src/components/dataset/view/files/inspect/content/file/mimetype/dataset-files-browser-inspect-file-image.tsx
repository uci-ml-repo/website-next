"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectFileInfoSize } from "@/components/dataset/view/files/inspect/content/file/mimetype/info/dataset-files-browser-inspect-file-info-size";
import { ROUTES } from "@/lib/routes";

export function DatasetFilesBrowserInspectFileImage() {
  const { currentPath, dataset } = useDatasetFilesBrowser();

  return (
    <div className="relative flex min-h-0 flex-1 justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ROUTES.CDN(String(dataset.id), dataset.slug, currentPath)}
        alt={currentPath}
        className="object-contain"
      />
      <DatasetFilesBrowserInspectFileInfoSize />
    </div>
  );
}
