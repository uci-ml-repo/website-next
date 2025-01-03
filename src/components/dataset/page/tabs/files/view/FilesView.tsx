import path from "path";

import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesViewDirectory from "@/components/dataset/page/tabs/files/view/FilesViewDirectory";
import FilesViewDownloadButton from "@/components/dataset/page/tabs/files/view/FilesViewDownloadButton";
import FilesViewFile from "@/components/dataset/page/tabs/files/view/FilesViewFile";
import FilesViewLinkGroups from "@/components/dataset/page/tabs/files/view/FilesViewLinkGroups";
import Spinner from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentDirectoryEntity } = useCurrentDirectoryEntity();

  const directoryQuery = trpc.files.find.list.useQuery(
    {
      path: currentDirectoryEntity.path,
    },
    {
      enabled: currentDirectoryEntity.type === "directory",
    },
  );

  const fileStatsQuery = trpc.files.read.stats.useQuery(
    {
      path: currentDirectoryEntity.path,
    },
    {
      enabled: currentDirectoryEntity.type === "file",
    },
  );

  return (
    <>
      <div className="sticky top-0 flex h-12 items-center justify-between border-b-2 bg-muted p-2">
        <div className="flex items-center space-x-2">
          <FilesViewLinkGroups dataset={dataset} />
          <div className="text-sm text-muted-foreground">
            {currentDirectoryEntity.type === "directory" ? (
              directoryQuery.data ? (
                <>({directoryQuery.data?.length} items)</>
              ) : (
                <Spinner className="size-4" />
              )
            ) : (
              currentDirectoryEntity.type === "file" &&
              (fileStatsQuery.data ? (
                <>({abbreviateFileSize(fileStatsQuery.data?.size)})</>
              ) : (
                <Spinner className="size-4" />
              ))
            )}
          </div>
        </div>

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
