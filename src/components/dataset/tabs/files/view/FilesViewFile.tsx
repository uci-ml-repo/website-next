import path from "path";
import React, { useEffect, useRef } from "react";

import {
  audioExtensions,
  imageExtensions,
  pdfExtensions,
  tabularToDelimiter,
  videoExtensions,
} from "@/components/dataset/tabs/files/lib/extensions";
import { FilesViewFileAudio } from "@/components/dataset/tabs/files/view/FilesViewFileAudio";
import { FilesViewFileImage } from "@/components/dataset/tabs/files/view/FilesViewFileImage";
import { FilesViewFilesTabular } from "@/components/dataset/tabs/files/view/FilesViewFileTabular";
import { FilesViewFileText } from "@/components/dataset/tabs/files/view/FilesViewFileText";
import { FilesViewFileVideo } from "@/components/dataset/tabs/files/view/FilesViewFileVideo";
import { FilesViewFilePDF } from "@/components/dataset/tabs/files/view/FilesViewPDF";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DirectoryEntity } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export function FilesViewFile({ file }: { file: DirectoryEntity }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const readFileQuery = trpc.file.read.readFileInfinite.useInfiniteQuery(
    {
      path: file.path,
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
  }, [file]);

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

  const extension = path.extname(file.path);
  const contentPath = path.join(STATIC_FILES_ROUTE, file.path);

  return imageExtensions.includes(extension) ? (
    <FilesViewFileImage source={contentPath} />
  ) : videoExtensions.includes(extension) ? (
    <FilesViewFileVideo source={contentPath} />
  ) : audioExtensions.includes(extension) ? (
    <FilesViewFileAudio source={contentPath} />
  ) : pdfExtensions.includes(extension) ? (
    <FilesViewFilePDF source={contentPath} />
  ) : (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-auto"
    >
      {Object.keys(tabularToDelimiter).includes(extension) ? (
        <FilesViewFilesTabular
          lines={lines}
          delimiter={tabularToDelimiter[extension]}
        />
      ) : (
        <FilesViewFileText lines={lines} />
      )}

      {readFileQuery.isFetchingNextPage && (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
