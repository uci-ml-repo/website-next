import type { DatasetSelect } from "@packages/db/types";
import { DownloadIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { abbreviateFileSize } from "@/lib/util/abbreviate";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetSelect;
};

export function DatasetDownloadButton({ dataset, ...props }: Props) {
  return (
    <Button size="lg" aria-label={`Download ${dataset.title}`} asChild {...props}>
      <a href={ROUTES.DATASET.ZIP(dataset)} download>
        <DownloadIcon />
        <span>
          Download
          {dataset.size && (
            <span className="text-blue-foreground/80 ml-1 text-sm">
              ({abbreviateFileSize(dataset.size)})
            </span>
          )}
        </span>
      </a>
    </Button>
  );
}
