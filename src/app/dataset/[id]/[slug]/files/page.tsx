import { notFound } from "next/navigation";

import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetFiles } from "@/components/dataset/tabs/files/DatasetFiles";
import { FileProvider } from "@/components/dataset/tabs/files/FilesContext";
import { Card, CardContent } from "@/components/ui/card";
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
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-8">
          <div className="text-pretty text-center">
            <div>Dataset files are not available to browse</div>
          </div>
          <DatasetDownloadButton dataset={dataset} className="w-fit" />
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
