"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { DownloadIcon, ExternalLinkIcon, UploadIcon } from "lucide-react";
import Link from "next/link";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DATASET_API_ZIP_ROUTE, DATASET_FILES_ROUTE } from "@/lib/routes";
import { abbreviateFileSize, cn } from "@/lib/utils";

interface DatasetDownloadButtonProps extends ButtonProps {}

export function DatasetDownloadButton({
  className,
  ...props
}: DatasetDownloadButtonProps) {
  const { dataset } = useDataset();
  const { filesStatus, size } = useDatasetFilesStatus();

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

  if (filesStatus === "awaiting-upload") {
    return (
      <Button asChild variant="gold" size="lg" className="lift w-full">
        <Link href={DATASET_FILES_ROUTE(dataset)}>
          <UploadIcon /> Upload Dataset Files
        </Link>
      </Button>
    );
  }

  if (filesStatus === "processing") {
    return (
      <Button disabled variant="gold" size="lg" className="lift w-full">
        <Spinner /> Processing Files
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
      <a href={DATASET_API_ZIP_ROUTE(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {size && (
            <span className="ml-1 text-sm">({abbreviateFileSize(size)})</span>
          )}
        </div>
      </a>
    </Button>
  );
}
