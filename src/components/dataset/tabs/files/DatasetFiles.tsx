"use client";

import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { ZipFileUploadForm } from "@/components/dataset/forms/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/forms/upload/ZipFileUploadProcessing";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/DatasetFilesBrowse";
import { DatasetFilesProvider } from "@/components/dataset/tabs/files/DatasetFilesContext";
import { Card, CardContent } from "@/components/ui/card";
import { DATASET_FILES_UNZIPPED_PATH } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export function DatasetFiles({ dataset }: { dataset: DatasetResponse }) {
  const { filesStatus } = useDatasetFilesStatus();

  if (filesStatus === "awaiting-upload") {
    return <ZipFileUploadForm dataset={dataset} />;
  }

  if (filesStatus === "not-unzipped") {
    return (
      <Card className="w-full">
        <CardContent className="flex h-32 items-center justify-center bg-muted">
          <div className="space-y-3 text-center">
            <div className="text-muted-foreground">
              <div>
                Files not available for browsing. Download the dataset to view
                files locally.
              </div>
            </div>
            <DatasetDownloadButton dataset={dataset} className="w-fit" />
          </div>
        </CardContent>
      </Card>
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
