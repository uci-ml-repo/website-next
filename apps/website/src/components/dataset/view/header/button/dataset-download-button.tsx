import { DownloadIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import type { DatasetSelect } from "@/server/types/dataset/response";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetSelect;
};

export function DatasetDownloadButton({ dataset, ...props }: Props) {
  return (
    <Button size="lg" aria-label={`Download ${dataset.title}`} asChild {...props}>
      <a href={ROUTES.DATASET.FILE(dataset)} download>
        <DownloadIcon />
        <div>
          <span>Download</span>
          {dataset.size && (
            <span className="text-blue-foreground/80 ml-1 text-sm">
              ({abbreviateFileSize(dataset.size)})
            </span>
          )}
        </div>
      </a>
    </Button>
  );
}
