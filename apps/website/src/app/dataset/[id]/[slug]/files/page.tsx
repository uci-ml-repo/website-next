import { InfoIcon } from "lucide-react";

import { DatasetFiles } from "@/components/dataset/view/files/dataset-files";
import { DatasetDownloadButton } from "@/components/dataset/view/header/button/dataset-download-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id: _id, slug } = await params;
  const id = Number(_id);
  const dataset = await trpc.dataset.find.byId({ datasetId: id });
  if (dataset.archiveKey) {
    return (
      <Alert variant="blue">
        <InfoIcon />
        <AlertTitle>Dataset archive</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>Download the ZIP archive to view the dataset files.</p>
          <DatasetDownloadButton dataset={dataset} />
        </AlertDescription>
      </Alert>
    );
  }

  return <DatasetFiles datasetId={id} slug={slug} />;
}
