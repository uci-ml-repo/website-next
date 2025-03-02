import path from "path";
import React, { useEffect, useRef } from "react";

import {
  audioExtensions,
  imageExtensions,
  pdfExtensions,
  tabularToDelimiter,
  videoExtensions,
} from "@/components/dataset/tabs/files/lib/extensions";
import { DatasetFileViewFileAudio } from "@/components/dataset/tabs/files/view/DatasetFileViewFileAudio";
import { DatasetFileViewFileImage } from "@/components/dataset/tabs/files/view/DatasetFileViewFileImage";
import { FilesViewFilePDF } from "@/components/dataset/tabs/files/view/DatasetFileViewFilePDF";
import { DatasetFileViewFileTabular } from "@/components/dataset/tabs/files/view/DatasetFileViewFileTabular";
import { DatasetFileViewFileText } from "@/components/dataset/tabs/files/view/DatasetFileViewFileText";
import { DatasetFileViewFileVideo } from "@/components/dataset/tabs/files/view/DatasetFileViewFileVideo";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { Entry } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFileViewFile({ fileEntry }: { fileEntry: Entry }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const readFileQuery = trpc.file.read.readFileInfinite.useInfiniteQuery(
    {
      path: fileEntry.path,
      takeLines: 50,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    },
  );

  const lines = readFileQuery.data?.pages.flatMap((page) => page.lines) || [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [fileEntry]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = event.currentTarget;
    const bottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 200;

    if (
      bottom &&
      readFileQuery.hasNextPage &&
      !readFileQuery.isFetchingNextPage
    ) {
      readFileQuery.fetchNextPage();
    }
  };

  if (readFileQuery.isLoading) {
    return (
      <div className="flex min-w-fit items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (readFileQuery.error) {
    return <Alert variant="destructive">Error loading file contents</Alert>;
  }

  if (lines.length === 0 && !readFileQuery.hasNextPage) {
    return (
      <div className="min-w-fit p-4">
        <Alert className="text-nowrap">File is empty</Alert>
      </div>
    );
  }

  const extension = path.extname(fileEntry.path);
  const contentPath = path.join(STATIC_FILES_ROUTE, fileEntry.path);

  return imageExtensions.includes(extension) ? (
    <DatasetFileViewFileImage source={contentPath} />
  ) : videoExtensions.includes(extension) ? (
    <DatasetFileViewFileVideo source={contentPath} />
  ) : audioExtensions.includes(extension) ? (
    <DatasetFileViewFileAudio source={contentPath} />
  ) : pdfExtensions.includes(extension) ? (
    <FilesViewFilePDF source={contentPath} />
  ) : (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-auto"
    >
      {Object.keys(tabularToDelimiter).includes(extension) ? (
        <DatasetFileViewFileTabular
          lines={lines}
          delimiter={tabularToDelimiter[extension]}
        />
      ) : (
        <DatasetFileViewFileText lines={lines} />
      )}

      {readFileQuery.isFetchingNextPage && (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
