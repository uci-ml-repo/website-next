import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { DatasetFull } from "@/server/types/dataset/response";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetFull;
};

export function DatasetExternalLinkButton({ dataset, ...props }: Props) {
  if (!dataset.externalLink) {
    throw new Error();
  }

  return (
    <Button size="lg" aria-label={`Visit ${dataset.title}`} asChild {...props}>
      <a href={dataset.externalLink} target="_blank" rel="noreferrer">
        <ExternalLinkIcon />
        View External
      </a>
    </Button>
  );
}
