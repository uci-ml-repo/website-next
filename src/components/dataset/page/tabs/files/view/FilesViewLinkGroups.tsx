import path from "path";
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

  const basePath = datasetFilesDirectory(dataset);

  const relativePath = currentPath?.path.startsWith(basePath)
    ? currentPath.path.slice(basePath.length + 1)
    : "";

  const pathParts = relativePath ? relativePath.split("/") : [];

  return (
    <div className="ml-1 flex space-x-1 text-lg font-medium">
      {pathParts.map((part, index) => {
        const cumulativePath = path.join(
          basePath,
          ...pathParts.slice(0, index + 1),
        );

        const isLast = index === pathParts.length - 1;

        return (
          <React.Fragment key={index}>
            <span>/</span>
            {isLast ? (
              <span>{part}</span>
            ) : (
              <button
                className="text-link hover:underline"
                onClick={() => {
                  setCurrentPath({
                    path: cumulativePath,
                    name: part,
                    type: "directory",
                  });
                }}
              >
                {part}
              </button>
            )}
          </React.Fragment>
        );
      })}
      {pathParts.length === 0 && <span>/</span>}
    </div>
  );
}
