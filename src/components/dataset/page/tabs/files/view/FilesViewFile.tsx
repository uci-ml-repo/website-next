import React, { useEffect, useRef, useState } from "react";

import FilesViewFilesText from "@/components/dataset/page/tabs/files/view/FilesViewFilesText";
import { Alert } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import type { DirectoryEntity } from "@/server/service/files/find";
import { trpc } from "@/server/trpc/query/client";

export default function FilesViewFile({ file }: { file: DirectoryEntity }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [cachedLines, setCachedLines] = useState<string[]>([]);

  const readFileQuery = trpc.files.read.readFile.useInfiniteQuery(
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

  if (!file) {
    return <div className="p-4">No file selected</div>;
  }

  if (readFileQuery.isLoading && cachedLines.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (readFileQuery.error) {
    return <Alert variant="destructive">Error loading file contents</Alert>;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-auto"
    >
      {cachedLines.length === 0 && !readFileQuery.hasNextPage ? (
        <div className="p-4">
          <Alert>File is empty</Alert>
        </div>
      ) : (
        <FilesViewFilesText lines={cachedLines} />
      )}

      {readFileQuery.isFetchingNextPage && (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
