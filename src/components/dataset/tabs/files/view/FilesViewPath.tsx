import { HouseIcon } from "lucide-react";
import path from "path";
import React from "react";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { DATASET_RELATIVE_PATH } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilesViewPath({
  dataset,
  className,
}: {
  dataset: DatasetResponse;
  className?: string;
}) {
  const { currentEntry, setCurrentEntry } = useFileContext();

  const basePath = DATASET_RELATIVE_PATH(dataset);

  const relativePath = currentEntry.path.startsWith(basePath)
    ? currentEntry.path.slice(basePath.length + 1)
    : "";

  const pathParts = relativePath ? relativePath.split("/") : [];

  return (
    <div
      className={cn(
        "ml-1 flex items-center space-x-1 overflow-hidden text-lg",
        className,
      )}
    >
      {pathParts.map((part, index) => {
        const cumulativePath = path.join(
          basePath,
          ...pathParts.slice(0, index + 1),
        );

        const isLast = index === pathParts.length - 1;

        return (
          <React.Fragment key={index}>
            {index === 0 && (
              <button
                className="text-link"
                onClick={() => {
                  setCurrentEntry({
                    path: basePath,
                    type: "directory",
                  });
                }}
              >
                <HouseIcon className="size-4 shrink-0" />
              </button>
            )}
            <span className="flex-shrink-0">/</span>
            {isLast ? (
              <span className="truncate max-md:text-sm">{part}</span>
            ) : (
              <button
                className="text-link hover:underline"
                onClick={() => {
                  setCurrentEntry({
                    path: cumulativePath,
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
      {pathParts.length === 0 && <HouseIcon className="size-4 shrink-0" />}
    </div>
  );
}
