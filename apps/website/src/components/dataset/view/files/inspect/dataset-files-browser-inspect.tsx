"use client";

import type { DatasetSelect } from "@packages/db/types";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

interface Props {
  dataset: DatasetSelect;
}

export function DatasetFilesBrowserInspect({ dataset }: Props) {
  const { currentPath, history, forwardHistory, back, forward, currentEntryType } =
    useDatasetFilesBrowser();

  return (
    <div className="overflow-hidden">
      <div className="flex h-10 items-center justify-between border-b px-1">
        <div className="flex *:size-8 *:rounded-sm">
          <Button
            variant="ghost"
            size="icon"
            disabled={!history.length}
            onClick={back}
            aria-label="Go back in file history"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!forwardHistory.length}
            onClick={forward}
            aria-label="Go forward in file history"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <div>
          {currentEntryType === "file" && (
            <Button
              variant="outline"
              className="size-7.5 rounded-sm"
              size="icon"
              aria-label={`Download ${currentPath}`}
              asChild
            >
              <a download href={ROUTES.CDN(dataset.id, dataset.slug, currentPath)}>
                <DownloadIcon className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
      <div>{JSON.stringify(currentPath)}</div>
    </div>
  );
}
