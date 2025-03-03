import { notFound } from "next/navigation";

import { ZipFileUploadForm } from "@/components/dataset/forms/upload/ZipFileUploadForm";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFilesBrowse } from "@/components/dataset/tabs/files/DatasetFilesBrowse";
import { FileProvider } from "@/components/dataset/tabs/files/FilesContext";
import { Card, CardContent } from "@/components/ui/card";
import { DATASET_FILES_UNZIPPED_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  let dataset;
  try {
    dataset = await caller.dataset.find.byId({ datasetId: Number(id) });
  } catch {
    dataset = null;
  }

  if (!dataset) {
    return notFound();
  }

  if (dataset.fileCount === null || dataset.unzipped === null) {
    return (
      <ZipFileUploadForm
        dataset={dataset}
        processing={dataset.unzipped === null && dataset.fileCount !== null}
      />
    );
  }

  if (dataset.unzipped === false) {
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

  return (
    <FileProvider
      rootEntry={{
        path: DATASET_FILES_UNZIPPED_PATH(dataset),
        type: "directory",
      }}
    >
      <DatasetFilesBrowse dataset={dataset} />
    </FileProvider>
  );
}
