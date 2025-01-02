import path from "path";

import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesViewDownloadButton from "@/components/dataset/page/tabs/files/view/FilesViewDownloadButton";
import FilesViewLinkGroups from "@/components/dataset/page/tabs/files/view/FilesViewLinkGroups";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentPath } = useCurrentPath();

  return (
    <div>
      <div className="flex h-12 items-center justify-between border-b-2 bg-muted p-2">
        <FilesViewLinkGroups dataset={dataset} />
        {currentPath?.type === "file" && (
          <FilesViewDownloadButton
            path={path.join(STATIC_FILES_ROUTE, currentPath.path)}
          />
        )}
      </div>
      <div>FILE DATA HERE</div>
    </div>
  );
}
