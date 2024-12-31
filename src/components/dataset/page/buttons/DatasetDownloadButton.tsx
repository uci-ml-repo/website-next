import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize, datasetZipURL } from "@/lib/utils";

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

  return (
    <Button variant="blue" className="lift w-full" size="lg" asChild>
      <a href={datasetZipURL(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {dataset.zipSize && (
            <span className="ml-1 text-sm">
              ({abbreviateFileSize(dataset.zipSize)})
            </span>
          )}
        </div>
      </a>
    </Button>
  );
}
