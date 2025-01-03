import path from "path";

import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesViewDirectory from "@/components/dataset/page/tabs/files/view/FilesViewDirectory";
import FilesViewDownloadButton from "@/components/dataset/page/tabs/files/view/FilesViewDownloadButton";
import FilesViewFile from "@/components/dataset/page/tabs/files/view/FilesViewFile";
import FilesViewLinkGroups from "@/components/dataset/page/tabs/files/view/FilesViewLinkGroups";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentDirectoryEntity } = useCurrentDirectoryEntity();

  return (
    <>
      <div className="sticky top-0 flex h-12 items-center justify-between border-b-2 bg-muted p-2">
        <FilesViewLinkGroups dataset={dataset} />
        {currentDirectoryEntity.type === "file" && (
          <FilesViewDownloadButton
            path={path.join(STATIC_FILES_ROUTE, currentDirectoryEntity.path)}
          />
        )}
      </div>
      <>
        {currentDirectoryEntity.type === "directory" ? (
          <FilesViewDirectory directoryPath={currentDirectoryEntity.path} />
        ) : currentDirectoryEntity.type === "file" ? (
          <FilesViewFile file={currentDirectoryEntity} />
        ) : (
          <div>Unknown file type</div>
        )}
      </>
    </>
  );
}
