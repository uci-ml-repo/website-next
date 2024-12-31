"use client";

import FilesBrowseDirectory from "@/components/dataset/page/tabs/files/browse/FilesBrowseDirectory";
import FilesBrowseFile from "@/components/dataset/page/tabs/files/browse/FilesBrowseFile";
import { Alert } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesDirectory } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowse({ dataset }: { dataset: DatasetResponse }) {
  const rootDirectoryQuery = trpc.files.find.list.useQuery({
    path: `${datasetFilesDirectory(dataset)}/${dataset.slug}`,
  });

  if (rootDirectoryQuery.isError) {
    return <Alert variant="destructive">Error</Alert>;
  }

  if (rootDirectoryQuery.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      <div>Browse</div>
      {rootDirectoryQuery.isPending ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div>
          {rootDirectoryQuery.data &&
            rootDirectoryQuery.data.map((node, index) => {
              if (node.isDirectory) {
                return <FilesBrowseDirectory key={index} node={node} />;
              } else if (node.isFile) {
                return <FilesBrowseFile node={node} key={index} />;
              }
            })}
        </div>
      )}
    </div>
  );
}
