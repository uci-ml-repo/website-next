"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { ROUTES } from "@/lib/routes";

export function DatasetFilesBrowserInspectFileAudio() {
  const { currentPath, dataset } = useDatasetFilesBrowser();

  return (
    <div className="flex flex-1 items-center justify-center">
      <audio controls src={ROUTES.CDN(String(dataset.id), dataset.slug, currentPath)} />
    </div>
  );
}
