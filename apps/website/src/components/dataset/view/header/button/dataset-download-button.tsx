"use client";

import { DownloadIcon, Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import { trpc } from "@/server/trpc/query/client";
import type { DatasetFull } from "@/server/types/dataset/response";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetFull;
};

export function DatasetDownloadButton({ dataset, ...props }: Props) {
  const archive = trpc.file.read.downloadArchive.useQuery(
    { datasetId: dataset.id },
    { enabled: false, retry: false },
  );
  const contents = (
    <>
      {archive.isFetching ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
      <span>
        Download
        {dataset.size ? (
          <span className="text-blue-foreground/80 ml-1 text-sm">
            ({abbreviateFileSize(dataset.size)})
          </span>
        ) : null}
      </span>
    </>
  );

  if (dataset.archiveKey) {
    return (
      <Button
        size="lg"
        aria-label={`Download ${dataset.title}`}
        disabled={archive.isFetching}
        {...props}
        onClick={async () => {
          const result = await archive.refetch();
          if (result.data && !result.error) window.location.assign(result.data);
          else toast.error(result.error?.message || "Unable to download dataset");
        }}
      >
        {contents}
      </Button>
    );
  }

  return (
    <Button size="lg" aria-label={`Download ${dataset.title}`} asChild {...props}>
      <a href={ROUTES.DATASET.ZIP(dataset)} download>
        {contents}
      </a>
    </Button>
  );
}
