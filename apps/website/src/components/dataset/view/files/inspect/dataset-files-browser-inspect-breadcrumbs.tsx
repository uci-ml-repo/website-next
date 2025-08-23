"use client";

import { HomeIcon } from "@primer/octicons-react";
import { Fragment } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectBreadcrumbsButton } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-breadcrumbs-button";

export function DatasetFilesBrowserInspectBreadcrumbs() {
  const { currentPath, setCurrentPath } = useDatasetFilesBrowser();

  const pathParts = currentPath.split("/");

  return (
    <div className="bg-accent/80 flex max-w-4xl grow items-center overflow-x-auto rounded-sm">
      <DatasetFilesBrowserInspectBreadcrumbsButton
        aria-label="Go to root directory"
        current={currentPath === "/"}
        disabled={currentPath === "/"}
        onClick={() => setCurrentPath("/")}
      >
        <HomeIcon className="size-4" />
      </DatasetFilesBrowserInspectBreadcrumbsButton>
      {pathParts.map((part, i) => {
        const absolutePath = pathParts.slice(0, i + 1).join("/");
        if (!part.trim()) return null;

        return (
          <Fragment key={absolutePath}>
            {i === 0 ? <div /> : <div className="text-muted-foreground">/</div>}
            <DatasetFilesBrowserInspectBreadcrumbsButton
              aria-label={`Go to ${absolutePath}`}
              disabled={i === pathParts.length - 1}
              current={currentPath === absolutePath}
              onClick={() => setCurrentPath(absolutePath)}
            >
              {part}
            </DatasetFilesBrowserInspectBreadcrumbsButton>
          </Fragment>
        );
      })}
    </div>
  );
}
