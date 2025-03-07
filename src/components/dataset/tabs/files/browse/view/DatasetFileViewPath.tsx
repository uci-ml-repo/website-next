import { HouseIcon } from "lucide-react";
import path from "path";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFiles } from "@/components/dataset/tabs/files/browse/DatasetFilesContext";
import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
} from "@/lib/routes";

export function DatasetFileViewPath() {
  const { dataset, viewPendingFiles } = useDataset();
  const { currentEntry, setCurrentEntry } = useDatasetFiles();

  const basePath = viewPendingFiles
    ? DATASET_FILES_UNZIPPED_PENDING_PATH(dataset)
    : DATASET_FILES_UNZIPPED_PATH(dataset);

  const relativePath = currentEntry.path.startsWith(basePath)
    ? currentEntry.path.slice(basePath.length + 1)
    : "";

  const pathParts = relativePath ? relativePath.split("/") : [];

  return (
    <div className="min-w-0 flex-1 @container">
      <div className="ml-1 hidden items-center space-x-1 overflow-hidden text-lg @3xs:flex max-md:overflow-x-auto">
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
                <span className="md:truncate">{part}</span>
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
    </div>
  );
}
