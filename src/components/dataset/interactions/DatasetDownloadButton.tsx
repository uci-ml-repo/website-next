import type { Dataset } from "@prisma/client";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { datasetZip } from "@/lib/utils";

interface DatasetDownloadButtonProps {
  dataset: Dataset;
}

export default function DatasetDownloadButton({
  dataset,
}: DatasetDownloadButtonProps) {
  return (
    <Button pill variant={"blue"} className={"lift w-full"} size={"lg"} asChild>
      {dataset.externalLink ? (
        <Link href={dataset.externalLink} target={"_blank"}>
          <ExternalLinkIcon />
          <div>View Dataset</div>
        </Link>
      ) : (
        <a href={datasetZip(dataset)} download>
          <DownloadIcon />
          <div>
            Download <span className={"text-sm"}>{"(4.3 GB)"}</span>
          </div>
        </a>
      )}
    </Button>
  );
}
