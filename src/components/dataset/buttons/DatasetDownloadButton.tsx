import { sendGAEvent } from "@next/third-parties/google";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DATASET_ZIP_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize } from "@/lib/utils";

interface DatasetDownloadButtonProps {
  dataset: DatasetResponse;
}

export function DatasetDownloadButton({ dataset }: DatasetDownloadButtonProps) {
  if (dataset.externalLink) {
    return (
      <Button
        variant="blue"
        className="lift w-full"
        size="lg"
        asChild
        aria-label={`View ${dataset.title}`}
      >
        <Link href={dataset.externalLink} target="_blank">
          <ExternalLinkIcon />
          <div>View Dataset</div>
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="blue"
      className="lift w-full"
      size="lg"
      asChild
      aria-label={`Download ${dataset.title}`}
      onClick={() =>
        sendGAEvent("event", "dataset_download", {
          datasetId: dataset.id.toString(),
        })
      }
    >
      <a href={DATASET_ZIP_ROUTE(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {dataset && dataset.size && (
            <span className="ml-1 text-sm">
              ({abbreviateFileSize(dataset.size)})
            </span>
          )}
        </div>
      </a>
    </Button>
  );
}
