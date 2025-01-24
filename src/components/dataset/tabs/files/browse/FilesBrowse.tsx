"use client";

import debounce from "lodash/debounce";
import { CircleXIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import FilesBrowseDirectory from "@/components/dataset/tabs/files/browse/FilesBrowseDirectory";
import FilesBrowseFile from "@/components/dataset/tabs/files/browse/FilesBrowseFile";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesPath } from "@/lib/utils";
import type { DirectoryEntity } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowse({ dataset }: { dataset: DatasetResponse }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [isDebouncing, setIsDebouncing] = React.useState(false);

  const debounceSetSearchTerm = React.useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
        setIsDebouncing(false);
      }, 100),
    [],
  );

  React.useEffect(() => {
    return () => {
      debounceSetSearchTerm.cancel();
    };
  }, [debounceSetSearchTerm]);

  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setDebouncedSearchTerm("");
      setIsDebouncing(false);
      debounceSetSearchTerm.cancel();
    } else {
      setIsDebouncing(true);
      debounceSetSearchTerm(searchTerm);
    }
  }, [searchTerm, debounceSetSearchTerm]);

  const rootDirectoryQuery = trpc.file.find.list.useQuery({
    path: datasetFilesPath(dataset),
  });

  const searchQuery = trpc.file.find.search.useQuery(
    {
      path: datasetFilesPath(dataset),
      search: debouncedSearchTerm,
    },
    {
      enabled: debouncedSearchTerm.length > 0,
    },
  );

  const isLoading =
    rootDirectoryQuery.isLoading || searchQuery.isLoading || isDebouncing;

  const data: DirectoryEntity[] =
    debouncedSearchTerm.length > 0 && searchQuery.data
      ? searchQuery.data
      : (rootDirectoryQuery.data ?? []);

  return (
    <>
      <div className="sticky left-0 top-0 flex h-12 shrink-0 items-center border-b-2 bg-muted px-2">
        <InputClearable
          variantSize="sm"
          icon={SearchIcon}
          placeholder="Search files"
          className="h-8 rounded-lg bg-background"
          containerClassName="w-full"
          value={searchTerm}
          setValue={setSearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="h-full w-full overflow-auto bg-muted">
        {isLoading ? (
          <div className="flex h-16 w-full items-center justify-center">
            <Spinner />
          </div>
        ) : data.length === 0 ? (
          <div className="p-2">
            {debouncedSearchTerm.length === 0 ? (
              <Alert>No files</Alert>
            ) : (
              <Alert className="flex min-w-fit items-center justify-between gap-2 text-nowrap">
                <span className="text-muted-foreground">No results</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  <CircleXIcon />
                  <span>Clear search</span>
                </Button>
              </Alert>
            )}
          </div>
        ) : (
          <div className="min-w-fit space-y-2 p-2">
            {debouncedSearchTerm.length > 0 && (
              <div className="text-muted-foreground">Search Results:</div>
            )}
            <div>
              {data.map((directoryEntity) => {
                if (directoryEntity.type === "directory") {
                  return (
                    <FilesBrowseDirectory
                      key={directoryEntity.path}
                      directory={directoryEntity}
                    />
                  );
                } else if (directoryEntity.type === "file") {
                  return (
                    <FilesBrowseFile
                      file={directoryEntity}
                      key={directoryEntity.path}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
