import { notFound } from "next/navigation";

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
  const unzippedFilesExists = await caller.file.find.exists({
    path: DATASET_RELATIVE_UNZIPPED_PATH(dataset),
  });

  if (!dataset) {
    return notFound();
  }

  return unzippedFilesExists ? (
    <FileProvider
      initialPath={{ path: datasetFilesPath(dataset), type: "directory" }}
    >
      <DatasetFiles dataset={dataset} />
    </FileProvider>
  ) : (
    <Card>
      <CardContent className="flex flex-col items-center justify-center space-y-2 p-8">
        <div className="text-pretty text-center">
          Dataset is too large to browse.
        </div>
        <DatasetDownloadButton dataset={dataset} className="w-fit" />
      </CardContent>
    </Card>
  );
}
