import React from "react";

import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesDirectory } from "@/lib/utils";

export default function FilesViewLinkGroups({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const { currentPath, setCurrentPath } = useCurrentPath();

  const pathParts = currentPath?.path
    .slice(datasetFilesDirectory(dataset).length - dataset.slug.length)
    .split("/");

  return (
    <div>
      {pathParts ? (
        <div className="flex space-x-1 font-medium">
          {pathParts.map((path, index) => (
            <React.Fragment key={index}>
              <div>/</div>
              <div>{path}</div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div>/</div>
      )}
    </div>
  );
}
