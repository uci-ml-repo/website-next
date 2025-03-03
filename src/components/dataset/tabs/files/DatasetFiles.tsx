"use client";

import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { ZipFileUploadForm } from "@/components/dataset/forms/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/forms/upload/ZipFileUploadProcessing";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/DatasetFilesBrowse";
import { DatasetFilesProvider } from "@/components/dataset/tabs/files/DatasetFilesContext";
import { AlternativeCard } from "@/components/ui/card";
import { DATASET_FILES_UNZIPPED_PATH } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export function DatasetFiles({ dataset }: { dataset: DatasetResponse }) {
  const { filesStatus } = useDatasetFilesStatus();

  if (filesStatus === "awaiting-upload") {
    return <ZipFileUploadForm dataset={dataset} />;
  }

  if (filesStatus === "not-unzipped") {
    return (
      <AlternativeCard>
        <div className="text-pretty text-center text-muted-foreground">
          Files not available for browsing. This may be because the dataset is
          too large. Download the dataset to view files locally.
        </div>
        <DatasetDownloadButton dataset={dataset} className="w-fit" />
      </AlternativeCard>
    );
  }

  if (filesStatus === "unzipped") {
    return (
      <DatasetFilesProvider
        rootEntry={{
          path: DATASET_FILES_UNZIPPED_PATH(dataset),
          type: "directory",
        }}
      >
        <DatasetFilesBrowse dataset={dataset} />
      </DatasetFilesProvider>
    );
  }

  // filesStatus === "processing"
  return <ZipFileUploadProcessing />;
}
