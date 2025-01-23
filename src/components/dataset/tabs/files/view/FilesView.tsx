import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import path from "path";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import FilesViewDirectory from "@/components/dataset/tabs/files/view/FilesViewDirectory";
import FilesViewDownloadButton from "@/components/dataset/tabs/files/view/FilesViewDownloadButton";
import FilesViewFile from "@/components/dataset/tabs/files/view/FilesViewFile";
import FilesViewLinkGroups from "@/components/dataset/tabs/files/view/FilesViewLinkGroups";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentFile, fileHistory, back, fileForwardHistory, forward } =
    useFileContext();

  const directoryQuery = trpc.files.find.list.useQuery(
    {
      path: currentFile.path,
    },
    {
      enabled: currentFile.type === "directory",
    },
  );

  const fileStatsQuery = trpc.files.read.stats.useQuery(
    {
      path: currentFile.path,
    },
    {
      enabled: currentFile.type === "file",
    },
  );

  return (
    <>
      <div className="sticky top-0 flex h-12 items-center justify-between space-x-2 border-b-2 bg-muted p-1 pr-2">
        <div className="flex w-full items-center space-x-2 truncate">
          <div className="flex flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              disabled={fileHistory.length === 0}
              onClick={back}
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={fileForwardHistory.length === 0}
              onClick={forward}
            >
              <ChevronRightIcon className="size-6" />
            </Button>
          </div>
          <div className="min-w-0 flex-1">
            <FilesViewLinkGroups dataset={dataset} />
          </div>
          <div className="whitespace-nowrap text-sm text-muted-foreground">
            {currentFile.type === "directory" ? (
              directoryQuery.data ? (
                <span className="mr-1">
                  ({directoryQuery.data?.length} items)
                </span>
              ) : (
                <Spinner className="size-4" />
              )
            ) : (
              currentFile.type === "file" &&
              (fileStatsQuery.data ? (
                <>({abbreviateFileSize(fileStatsQuery.data?.size)})</>
              ) : (
                <Spinner className="size-4" />
              ))
            )}
          </div>
        </div>

        {currentFile.type === "file" && (
          <FilesViewDownloadButton
            path={path.join(STATIC_FILES_ROUTE, currentFile.path)}
          />
        )}
      </div>
      <>
        {currentFile.type === "directory" ? (
          <FilesViewDirectory directoryPath={currentFile.path} />
        ) : currentFile.type === "file" ? (
          <FilesViewFile file={currentFile} />
        ) : (
          <div>Unknown file type</div>
        )}
      </>
    </>
  );
}
