import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DATASET_ZIP_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize, datasetFilesPath } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

interface DatasetDownloadButtonProps {
  dataset: DatasetResponse;
}

export default async function DatasetDownloadButton({
  dataset,
}: DatasetDownloadButtonProps) {
  if (dataset.externalLink) {
    return (
      <Button variant="blue" className="lift w-full" size="lg" asChild>
        <Link href={dataset.externalLink} target="_blank">
          <ExternalLinkIcon />
          <div>View Dataset</div>
        </Link>
      </Button>
    );
  }

  let zipStats;
  try {
    zipStats = await caller.file.read.zipStats({
      path: datasetFilesPath(dataset) + ".zip",
    });
  } catch {
    zipStats = null;
  }

  return (
    <Button variant="blue" className="lift w-full" size="lg" asChild>
      <a href={DATASET_ZIP_ROUTE(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {zipStats && zipStats.size && (
            <span className="ml-1 text-sm">
              ({abbreviateFileSize(zipStats.size)})
            </span>
          )}
        </div>
      </a>
    </Button>
  );
}
