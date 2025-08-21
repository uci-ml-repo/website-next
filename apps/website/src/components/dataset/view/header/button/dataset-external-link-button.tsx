import type { DatasetSelect } from "@packages/db/types";
import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetSelect;
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
