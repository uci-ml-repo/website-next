"use client";

import { CircleXIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetFileTreeDirectory } from "@/components/dataset/tabs/files/browse/tree/DatasetFileTreeDirectory";
import { DatasetFileTreeFile } from "@/components/dataset/tabs/files/browse/tree/DatasetFileTreeFile";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import { Spinner } from "@/components/ui/spinner";
import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
} from "@/lib/routes";
import type { Entry } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFileTree() {
  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  const { dataset, viewPendingFiles } = useDataset();

  const rootDirectoryQuery = trpc.file.find.list.useQuery({
    path: viewPendingFiles
      ? DATASET_FILES_UNZIPPED_PENDING_PATH(dataset)
      : DATASET_FILES_UNZIPPED_PATH(dataset),
  });

  const searchQuery = trpc.file.find.search.useQuery(
    {
      path: viewPendingFiles
        ? DATASET_FILES_UNZIPPED_PENDING_PATH(dataset)
        : DATASET_FILES_UNZIPPED_PATH(dataset),
      search: searchValue,
    },
    {
      enabled: searchValue.length > 0,
    },
  );

  const isLoading = rootDirectoryQuery.isLoading || searchQuery.isLoading;

  const data: Entry[] =
    searchValue.length > 0 && searchQuery.data
      ? searchQuery.data
      : (rootDirectoryQuery.data ?? []);

  return (
    <>
      <div className="sticky left-0 top-0 flex h-12 shrink-0 items-center border-b-2 bg-muted px-2">
        <InputClearable
          icon={SearchIcon}
          placeholder="Search files"
          aria-label="Search files"
          className="h-8 rounded-lg bg-background"
          containerClassName="w-full"
          value={inputValue}
          setValue={setInputValue}
          onChange={handleChange}
        />
      </div>
      <div className="h-full w-full overflow-auto bg-muted">
        {isLoading ? (
          <div className="flex h-16 w-full items-center justify-center">
            <Spinner />
          </div>
        ) : data.length === 0 ? (
          <div className="p-2">
            {searchValue.length === 0 ? (
              <Alert>No files</Alert>
            ) : (
              <Alert className="flex min-w-fit items-center justify-between gap-2 text-nowrap">
                <span className="text-muted-foreground">No results</span>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  <CircleXIcon />
                  <span>Clear search</span>
                </Button>
              </Alert>
            )}
          </div>
        ) : (
          <div className="min-w-fit space-y-2 p-2">
            {searchValue.length > 0 && (
              <div className="text-muted-foreground">Search Results:</div>
            )}
            <div>
              {data.map((directoryEntity) =>
                directoryEntity.type === "directory" ? (
                  <DatasetFileTreeDirectory
                    key={directoryEntity.path}
                    directory={directoryEntity}
                  />
                ) : directoryEntity.type === "file" ? (
                  <DatasetFileTreeFile
                    file={directoryEntity}
                    key={directoryEntity.path}
                    displayFullPath={!!searchValue}
                  />
                ) : null,
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
