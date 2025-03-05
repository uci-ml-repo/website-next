"use client";

import Link from "next/link";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { ZipFileUploadForm } from "@/components/dataset/forms/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/forms/upload/ZipFileUploadProcessing";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/DatasetFilesBrowse";
import { DatasetFilesProvider } from "@/components/dataset/tabs/files/DatasetFilesContext";
import { AlternativeCard } from "@/components/ui/card";
import { CONTACT_ROUTE, DATASET_FILES_UNZIPPED_PATH } from "@/lib/routes";

export default function Page() {
  const { editing, dataset } = useDataset();
  const { filesStatus } = useDatasetFilesStatus();

  if (editing) {
    return (
      <div>
        <div className="text-2xl font-bold">Edit Dataset Files</div>

        <div className="pb-2 text-muted-foreground">
          <div>
            <span className="font-bold">Warning:</span> uploading a new zip file
            will overwrite your existing dataset files. This action cannot be
            undone.
          </div>
          <div>
            Upload a single zip file containing the entire contents of your
            dataset, including any additional files and documentation.
          </div>
          <div>
            Note: the maximum upload size is 512MB. If your dataset is larger
            than this, please{" "}
            <Link href={CONTACT_ROUTE} className="underline">
              contact us
            </Link>
            .
          </div>
        </div>

        <ZipFileUploadForm dataset={dataset} />
      </div>
    );
  }

  if (filesStatus === "awaiting-upload") {
    return (
      <div>
        <div className="text-2xl font-bold">Upload Dataset Files</div>

        <div className="pb-2 text-muted-foreground">
          <div>
            Upload a single zip file containing the entire contents of your
            dataset, including any additional files and documentation.
          </div>
          <div>
            Note: the maximum upload size is 512MB. If your dataset is larger
            than this, please{" "}
            <Link href={CONTACT_ROUTE} className="underline">
              contact us
            </Link>
            .
          </div>
        </div>

        <ZipFileUploadForm dataset={dataset} />
      </div>
    );
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
