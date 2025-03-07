"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/browse/DatasetFilesBrowse";
import { DatasetFilesProvider } from "@/components/dataset/tabs/files/browse/DatasetFilesContext";
import { ZipFileUploadForm } from "@/components/dataset/tabs/files/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/tabs/files/upload/ZipFileUploadProcessing";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { TabHeader } from "@/components/ui/tab-header";
import { Enums } from "@/db/lib/enums";
import {
  CONTACT_ROUTE,
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
} from "@/lib/routes";

export default function Page() {
  const {
    editing,
    dataset,
    editingFiles,
    setEditingFiles,
    viewPendingFiles,
    setViewPendingFiles,
  } = useDataset();

  const { fileStatus, pendingFileStatus } = useDatasetFileStatus();

  if (fileStatus === "awaiting-upload") {
    return (
      <div className="space-y-4">
        <div className="text-2xl font-bold">Upload Dataset Files</div>

        <div className="pb-2 text-muted-foreground">
          <div>
            Upload a single zip file containing the entire contents of your
            dataset, including any additional files and documentation.
          </div>
          <div>
            Note: the maximum upload size is 1GB. If your dataset is larger than
            this, please{" "}
            <Link href={CONTACT_ROUTE} className="underline">
              contact us
            </Link>
            .
          </div>
        </div>

        <ZipFileUploadForm />
      </div>
    );
  }

  if (editing && editingFiles) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Replace Dataset Files</div>
          <Button
            variant="secondary"
            className="lift"
            onClick={() => setEditingFiles(false)}
          >
            Cancel
          </Button>
        </div>

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
            Note: the maximum upload size is 1GB. If your dataset is larger than
            this, please{" "}
            <Link href={CONTACT_ROUTE} className="underline">
              contact us
            </Link>
            .
          </div>
        </div>

        <ZipFileUploadForm
          requireApproval={dataset.status !== Enums.ApprovalStatus.DRAFT}
        />
      </div>
    );
  }

  if (
    (!viewPendingFiles &&
      (fileStatus === "unzipped" || fileStatus === "not-unzipped")) ||
    (viewPendingFiles &&
      (pendingFileStatus === "unzipped" ||
        pendingFileStatus === "not-unzipped"))
  ) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabHeader title="Dataset Files" />
          {editing &&
            (dataset.status === Enums.ApprovalStatus.DRAFT ||
            viewPendingFiles ||
            pendingFileStatus === "awaiting-upload" ? (
              <div className="flex flex-wrap gap-2">
                {viewPendingFiles && (
                  <Button variant="gold">View current files</Button>
                )}
                <Button
                  variant="secondary"
                  className="lift"
                  onClick={() => setEditingFiles(true)}
                >
                  <PencilIcon /> Replace Files
                </Button>
              </div>
            ) : (
              <Button
                variant="gold"
                className="lift"
                onClick={() => setViewPendingFiles(true)}
              >
                View pending files
              </Button>
            ))}
        </div>
        {!viewPendingFiles && fileStatus === "unzipped" ? (
          <DatasetFilesProvider
            rootEntry={{
              path: DATASET_FILES_UNZIPPED_PATH(dataset),
              type: "directory",
            }}
          >
            <DatasetFilesBrowse />
          </DatasetFilesProvider>
        ) : viewPendingFiles && pendingFileStatus === "unzipped" ? (
          <DatasetFilesProvider
            rootEntry={{
              path: DATASET_FILES_UNZIPPED_PENDING_PATH(dataset),
              type: "directory",
            }}
          >
            <DatasetFilesBrowse />
          </DatasetFilesProvider>
        ) : (
          <AlternativeCard>
            <div className="text-pretty text-center text-muted-foreground">
              Files not available for browsing. This may be because the dataset
              is too large. Download the dataset to view files locally.
            </div>
            <DatasetDownloadButton className="w-fit" />
          </AlternativeCard>
        )}
      </div>
    );
  }

  // filesStatus === "processing"
  return <ZipFileUploadProcessing />;
}
