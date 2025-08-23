"use client";

import type { HTMLAttributes } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectory } from "@/components/dataset/view/files/inspect/content/directory/dataset-files-browser-inspect-directory";
import { DatasetFilesBrowserInspectFile } from "@/components/dataset/view/files/inspect/content/file/dataset-files-browser-inspect-file";
import { DatasetFilesBrowserInspectHeader } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-header";
import { DatasetFilesBrowserInspectSearchResults } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-search-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspect({ dataset, className, ...props }: Props) {
  const { currentEntryType, search } = useDatasetFilesBrowser();

  return (
    <div className={cn("flex size-full flex-col overflow-hidden", className)} {...props}>
      <DatasetFilesBrowserInspectHeader dataset={dataset} />

      {search !== undefined ? (
        <DatasetFilesBrowserInspectSearchResults />
      ) : currentEntryType === "directory" ? (
        <DatasetFilesBrowserInspectDirectory />
      ) : (
        <ScrollArea className="size-full min-h-0" type="auto" vertical horizontal>
          <DatasetFilesBrowserInspectFile />
        </ScrollArea>
      )}
    </div>
  );
}
