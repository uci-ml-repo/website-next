import type { Dataset } from "@prisma/client";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { datasetZip } from "@/lib/utils";

interface DatasetDownloadProps {
  dataset: Dataset;
}

export default function DatasetDownload({ dataset }: DatasetDownloadProps) {
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
          <div>Download (4.3 GB)</div>
        </a>
      )}
    </Button>
  );
}
