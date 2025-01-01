"use client";

import { SearchIcon } from "lucide-react";

import FilesBrowseDirectory from "@/components/dataset/page/tabs/files/browse/FilesBrowseDirectory";
import FilesBrowseFile from "@/components/dataset/page/tabs/files/browse/FilesBrowseFile";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesDirectory } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowse({ dataset }: { dataset: DatasetResponse }) {
  const rootDirectoryQuery = trpc.files.find.list.useQuery({
    path: datasetFilesDirectory(dataset),
  });

  if (rootDirectoryQuery.isError) {
    return <Alert variant="destructive">Error</Alert>;
  }

  if (rootDirectoryQuery.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="sticky left-0 top-0 flex h-12 shrink-0 items-center justify-center border-b-2 bg-muted px-2">
        <Input
          variantSize="sm"
          icon={SearchIcon}
          placeholder="Search files"
          className="h-8 rounded-lg bg-background"
          containerClassName="w-full"
        />
      </div>
      <div className="h-full w-full overflow-auto bg-muted">
        <div className="min-w-fit p-2">
          {rootDirectoryQuery.data &&
            rootDirectoryQuery.data.map((node, index) => {
              if (node.type === "directory") {
                return <FilesBrowseDirectory key={index} node={node} />;
              } else if (node.type === "file") {
                return <FilesBrowseFile node={node} key={index} />;
              }
            })}
        </div>
      </div>
    </>
  );
}
