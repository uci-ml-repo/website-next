import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { DatasetSelect } from "@/server/types/dataset/response";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetSelect;
};

export function DatasetExternalLinkButton({ dataset, ...props }: Props) {
  if (!dataset.externalLink) {
    throw new Error();
  }

  return (
    <Button size="lg" aria-label={`Download ${dataset.title}`} asChild {...props}>
      <a href={dataset.externalLink} target="_blank" rel="noreferrer">
        <ExternalLinkIcon />
        View External
      </a>
    </Button>
  );
}
