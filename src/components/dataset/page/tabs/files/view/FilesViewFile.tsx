import path from "path";
import React, { useEffect, useRef, useState } from "react";

import FilesViewFileImage from "@/components/dataset/page/tabs/files/view/FilesViewFileImage";
import FilesViewFilesTabular from "@/components/dataset/page/tabs/files/view/FilesViewFileTabular";
import FilesViewFileText from "@/components/dataset/page/tabs/files/view/FilesViewFileText";
import { Alert } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import { imageExtensions, tabularToDelimiter } from "@/lib/utils/file";
import type { DirectoryEntity } from "@/server/service/files/find";
import { trpc } from "@/server/trpc/query/client";

export default function FilesViewFile({ file }: { file: DirectoryEntity }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [cachedLines, setCachedLines] = useState<string[]>([]);

  const readFileQuery = trpc.files.read.readFileInfinite.useInfiniteQuery(
    {
      path: file.path,
      takeLines: 50,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    },
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [file]);

  useEffect(() => {
    const lines = readFileQuery.data?.pages.flatMap((page) => page.lines) || [];
    if (lines.length > 0 || !readFileQuery.isFetching) {
      setCachedLines(lines);
    }
  }, [readFileQuery.data?.pages, readFileQuery.isFetching]);

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

  if (readFileQuery.isLoading && cachedLines.length === 0) {
    return (
      <div className="flex min-w-fit items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (readFileQuery.error) {
    return <Alert variant="destructive">Error loading file contents</Alert>;
  }

  if (cachedLines.length === 0 && !readFileQuery.hasNextPage) {
    return (
      <div className="min-w-fit p-4">
        <Alert className="text-nowrap">File is empty</Alert>
      </div>
    );
  }

  return imageExtensions.includes(file.extension!) ? (
    <FilesViewFileImage source={path.join(STATIC_FILES_ROUTE, file.path)} />
  ) : (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-auto"
    >
      {Object.keys(tabularToDelimiter).includes(file.extension!) ? (
        <FilesViewFilesTabular
          lines={cachedLines}
          delimiter={tabularToDelimiter[file.extension!]}
        />
      ) : (
        <FilesViewFileText lines={cachedLines} />
      )}

      {readFileQuery.isFetchingNextPage && (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
