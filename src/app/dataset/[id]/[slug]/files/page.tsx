"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { ZipFileUploadForm } from "@/components/dataset/forms/upload/ZipFileUploadForm";
import { ZipFileUploadProcessing } from "@/components/dataset/forms/upload/ZipFileUploadProcessing";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/DatasetFilesBrowse";
import { DatasetFilesProvider } from "@/components/dataset/tabs/files/DatasetFilesContext";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { TabHeader } from "@/components/ui/tab-header";
import { CONTACT_ROUTE, DATASET_FILES_UNZIPPED_PATH } from "@/lib/routes";
import { isDraftOrPending } from "@/lib/utils/dataset";

export default function Page() {
  const { editing, dataset, editingFiles, setEditingFiles } = useDataset();
  const { filesStatus } = useDatasetFilesStatus();

  if (filesStatus === "awaiting-upload") {
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

        <ZipFileUploadForm dataset={dataset} />
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
          dataset={dataset}
          requireApproval={!isDraftOrPending(dataset)}
        />
      </div>
    );
  }

  if (filesStatus === "not-unzipped") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <TabHeader title="Dataset Files" />
          {editing && (
            <Button
              variant="secondary"
              className="lift"
              onClick={() => setEditingFiles(true)}
            >
              <PencilIcon /> Replace Files
            </Button>
          )}
        </div>
        <AlternativeCard>
          <div className="text-pretty text-center text-muted-foreground">
            Files not available for browsing. This may be because the dataset is
            too large. Download the dataset to view files locally.
          </div>
          <DatasetDownloadButton className="w-fit" />
        </AlternativeCard>
      </div>
    );
  }

  if (filesStatus === "unzipped") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <TabHeader title="Dataset Files" />
          {editing && (
            <Button
              variant="secondary"
              className="lift"
              onClick={() => setEditingFiles(true)}
            >
              <PencilIcon /> Replace Files
            </Button>
          )}
        </div>
        <DatasetFilesProvider
          rootEntry={{
            path: DATASET_FILES_UNZIPPED_PATH(dataset),
            type: "directory",
          }}
        >
          <DatasetFilesBrowse dataset={dataset} />
        </DatasetFilesProvider>
      </div>
    );
  }

  // filesStatus === "processing"
  return <ZipFileUploadProcessing />;
}
