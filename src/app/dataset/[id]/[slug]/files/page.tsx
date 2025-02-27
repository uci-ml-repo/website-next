import { notFound } from "next/navigation";

import { ZipFileUploadForm } from "@/components/dataset/forms/ZipFileUploadForm";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFiles } from "@/components/dataset/tabs/files/DatasetFiles";
import { FileProvider } from "@/components/dataset/tabs/files/FilesContext";
import { Card, CardContent } from "@/components/ui/card";
import { DATASET_RELATIVE_UNZIPPED_PATH } from "@/lib/routes";
import { datasetFilesPath } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const dataset = await caller.dataset.find.byId({ datasetId: Number(id) });

  if (!dataset) {
    return notFound();
  }

  if (dataset.fileCount === null) {
    return <ZipFileUploadForm dataset={dataset} />;
  }

  let unzippedExists;
  try {
    unzippedExists = await caller.file.find.exists({
      path: DATASET_RELATIVE_UNZIPPED_PATH(dataset),
    });
  } catch {
    unzippedExists = false;
  }

  if (!unzippedExists) {
    return (
      <Card className="w-full">
        <CardContent className="flex h-[130px] items-center justify-center bg-muted">
          <div className="space-y-3 text-center">
            <div className="text-muted-foreground">
              There are no discussions yet
            </div>
            <DatasetDownloadButton dataset={dataset} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FileProvider
      initialPath={{ path: datasetFilesPath(dataset), type: "directory" }}
    >
      <DatasetFiles dataset={dataset} />
    </FileProvider>
  );
}
