"use client";

import { PencilIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFileBrowserProvider } from "@/components/dataset/tabs/files/browse/DatasetFileBrowserContext";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/browse/DatasetFilesBrowse";
import { ZipFileUploadForm } from "@/components/dataset/tabs/files/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/tabs/files/upload/ZipFileUploadProcessing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TabHeader } from "@/components/ui/tab-header";
import { Enums } from "@/db/lib/enums";
import { CONTACT_ROUTE } from "@/lib/routes";

export default function Page() {
  const {
    editing,
    dataset,
    editingFields,
    stopEditingField,
    startEditingField,
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

  if (editing && editingFields.includes("files")) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Replace Dataset Files</div>
          <Button
            variant="secondary"
            className="lift"
            onClick={() => stopEditingField("files")}
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

        <ZipFileUploadForm />
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
          <div className="flex items-center space-x-2">
            <TabHeader title="Dataset Files" />
            {viewPendingFiles && <Badge variant="gold-strong">PENDING</Badge>}
          </div>
          {editing &&
            (dataset.status === Enums.ApprovalStatus.DRAFT ||
            viewPendingFiles ||
            pendingFileStatus === "awaiting-upload" ? (
              <div className="flex flex-wrap gap-2">
                {viewPendingFiles && (
                  <Button
                    variant="gold"
                    className="lift"
                    onClick={() => setViewPendingFiles(false)}
                  >
                    <RotateCcwIcon /> View current files
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="lift"
                  onClick={() => startEditingField("files")}
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
                <PencilIcon /> View pending files
              </Button>
            ))}
        </div>
        {(!viewPendingFiles && fileStatus === "unzipped") ||
        (viewPendingFiles && pendingFileStatus === "unzipped") ? (
          <DatasetFileBrowserProvider>
            <DatasetFilesBrowse />
          </DatasetFileBrowserProvider>
        ) : (
          <AlternativeCard>
            <div className="text-pretty text-center text-muted-foreground">
              Files are not available for browsing. This may be because the
              dataset is too large. Download the dataset to view files locally.
            </div>
            <DatasetDownloadButton className="w-fit" />
          </AlternativeCard>
        )}
      </div>
    );
  }

  if (fileStatus === "unzipping" || pendingFileStatus === "unzipping") {
    return <ZipFileUploadProcessing />;
  }

  return (
    <div className="flex h-20 w-full items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
