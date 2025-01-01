import { DownloadIcon } from "lucide-react";
import path from "path";

import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesViewLinkGroups from "@/components/dataset/page/tabs/files/view/FilesViewLinkGroups";
import { Button } from "@/components/ui/button";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentPath } = useCurrentPath();

  return (
    <div>
      <div className="flex h-12 items-center justify-between bg-muted p-2">
        <FilesViewLinkGroups dataset={dataset} />
        {currentPath?.isFile && (
          <Button
            pill={false}
            variant="outline"
            size="icon"
            className="size-8"
            asChild
          >
            <a href={path.join(STATIC_FILES_ROUTE, currentPath.path)} download>
              <DownloadIcon />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
