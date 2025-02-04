import { notFound } from "next/navigation";

import DatasetFiles from "@/components/dataset/tabs/files/DatasetFiles";
import { FileProvider } from "@/components/dataset/tabs/files/FilesContext";
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

  return (
    <FileProvider
      initialPath={{ path: datasetFilesPath(dataset), type: "directory" }}
    >
      <DatasetFiles dataset={dataset} />
    </FileProvider>
  );
}
