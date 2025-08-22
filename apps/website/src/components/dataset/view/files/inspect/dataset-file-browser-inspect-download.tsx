import { DownloadIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

interface Props {
  dataset: { id: number; slug: string };
}

export function DatasetFileBrowserInspectDownload({ dataset }: Props) {
  const { currentPath, currentEntryType } = useDatasetFilesBrowser();

  return (
    currentEntryType === "file" && (
      <Button
        variant="outline"
        className="size-7 rounded-sm"
        size="icon"
        aria-label={`Download ${currentPath}`}
        asChild
      >
        <a download href={ROUTES.CDN(dataset.id, dataset.slug, currentPath)}>
          <DownloadIcon className="size-4" />
        </a>
      </Button>
    )
  );
}
