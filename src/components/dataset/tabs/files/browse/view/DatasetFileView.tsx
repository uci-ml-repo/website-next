import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import path from "path";

import { useDatasetFiles } from "@/components/dataset/tabs/files/browse/DatasetFilesContext";
import { DatasetFileViewDirectory } from "@/components/dataset/tabs/files/browse/view/DatasetFileViewDirectory";
import { DatasetFileViewDownloadButton } from "@/components/dataset/tabs/files/browse/view/DatasetFileViewDownloadButton";
import { DatasetFileViewFile } from "@/components/dataset/tabs/files/browse/view/DatasetFileViewFile";
import { DatasetFileViewPath } from "@/components/dataset/tabs/files/browse/view/DatasetFileViewPath";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFileView({ dataset }: { dataset: DatasetResponse }) {
  const { currentEntry, fileHistory, back, fileForwardHistory, forward } =
    useDatasetFiles();

  const directoryQuery = trpc.file.find.list.useQuery(
    {
      path: currentEntry.path,
    },
    {
      enabled: currentEntry.type === "directory",
    },
  );

  const fileStatsQuery = trpc.file.read.stats.useQuery(
    {
      path: currentEntry.path,
    },
    {
      enabled: currentEntry.type === "file",
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
              aria-label="Back"
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={fileForwardHistory.length === 0}
              onClick={forward}
              aria-label="Forward"
            >
              <ChevronRightIcon className="size-6" />
            </Button>
          </div>
          <div className="min-w-0 flex-1">
            <DatasetFileViewPath dataset={dataset} />
          </div>
          <div className="whitespace-nowrap text-sm text-muted-foreground">
            {currentEntry.type === "directory" ? (
              directoryQuery.data ? (
                <span className="mr-1">
                  ({directoryQuery.data?.length} items)
                </span>
              ) : (
                <Spinner className="size-4" />
              )
            ) : (
              currentEntry.type === "file" &&
              (fileStatsQuery.data ? (
                <>({abbreviateFileSize(fileStatsQuery.data?.size)})</>
              ) : (
                <Spinner className="size-4" />
              ))
            )}
          </div>
        </div>

        {currentEntry.type === "file" && (
          <DatasetFileViewDownloadButton
            path={path.join(STATIC_FILES_ROUTE, currentEntry.path)}
          />
        )}
      </div>
      <>
        {currentEntry.type === "directory" ? (
          <DatasetFileViewDirectory directoryEntry={currentEntry} />
        ) : currentEntry.type === "file" ? (
          <DatasetFileViewFile fileEntry={currentEntry} />
        ) : (
          <div>Unknown file type</div>
        )}
      </>
    </>
  );
}
