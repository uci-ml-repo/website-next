"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { DATASET_ZIP_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize, cn } from "@/lib/utils";

interface DatasetDownloadButtonProps extends ButtonProps {
  dataset: DatasetResponse;
}

export function DatasetDownloadButton({
  dataset,
  className,
  ...props
}: DatasetDownloadButtonProps) {
  if (dataset.externalLink) {
    return (
      <Button
        variant="blue"
        className={cn("lift w-full", className)}
        size="lg"
        asChild
        aria-label={`View ${dataset.title}`}
        onClick={() =>
          sendGAEvent("event", "visit_external", {
            datasetId: dataset.id.toString(),
          })
        }
        {...props}
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
      className={cn("lift w-full", className)}
      size="lg"
      asChild
      aria-label={`Download ${dataset.title}`}
      onClick={() =>
        sendGAEvent("event", "dataset_download", {
          datasetId: dataset.id.toString(),
        })
      }
      {...props}
    >
      <a href={DATASET_ZIP_ROUTE(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {dataset && dataset.compressedSize && (
            <span className="ml-1 text-sm">
              ({abbreviateFileSize(dataset.compressedSize)})
            </span>
          )}
        </div>
      </a>
    </Button>
  );
}
