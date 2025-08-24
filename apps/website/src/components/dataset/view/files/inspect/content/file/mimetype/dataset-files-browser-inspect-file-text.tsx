"use client";

import { useInViewport } from "@mantine/hooks";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectFileInfoSize } from "@/components/dataset/view/files/inspect/content/file/mimetype/info/dataset-files-browser-inspect-file-info-size";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFilesBrowserInspectFileText() {
  const { currentPath, dataset } = useDatasetFilesBrowser();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, error } =
    trpc.file.read.readBytes.useInfiniteQuery(
      {
        datasetId: dataset.id,
        key: currentPath,
        take: 65_536,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        ...skipBatch,
      },
    );

  const { ref: bottomRef, inViewport: bottomInViewport } = useInViewport();

  useEffect(() => {
    if (!isFetchingNextPage && bottomInViewport) {
      fetchNextPage();
    }
  }, [bottomInViewport, fetchNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <div className="p-2">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Failed to read file</AlertTitle>
          <AlertDescription>{error.message || "An unknown error occurred."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-x-2 p-2 text-sm">
        <Loader2Icon className="size-4 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div>
      {data && (
        <pre className="p-2 whitespace-pre">{data.pages.map((page) => page.text).join()}</pre>
      )}

      {hasNextPage ? (
        <div ref={bottomRef} />
      ) : (
        data && (
          <div className="text-muted-foreground bg-accent-strong border-t p-1 text-sm not-group-has-[[data-slot='scroll-area-scrollbar'][data-orientation='vertical']]:hidden">
            End of file
          </div>
        )
      )}

      {isFetchingNextPage && (
        <div className="text-muted-foreground bg-accent-strong flex items-center gap-x-2 border-t p-1 text-sm">
          <Loader2Icon className="size-4 animate-spin" /> Loading more...
        </div>
      )}

      <DatasetFilesBrowserInspectFileInfoSize />
    </div>
  );
}
