import path from "path";
import React from "react";

import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import type { DatasetResponse } from "@/lib/types";
import { cn, datasetFilesDirectory } from "@/lib/utils";

export default function FilesViewLinkGroups({
  dataset,
  className,
}: {
  dataset: DatasetResponse;
  className?: string;
}) {
  const { currentDirectoryEntity, setCurrentDirectoryEntity } =
    useCurrentDirectoryEntity();

  const basePath = datasetFilesDirectory(dataset);

  const relativePath = currentDirectoryEntity.path.startsWith(basePath)
    ? currentDirectoryEntity.path.slice(basePath.length + 1)
    : "";

  const pathParts = relativePath ? relativePath.split("/") : [];

  return (
    <div className={cn("ml-1 flex space-x-1 text-lg font-medium", className)}>
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
                  setCurrentDirectoryEntity({
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
