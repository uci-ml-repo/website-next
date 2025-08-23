"use client";

import type { HTMLAttributes } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectDirectory } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-directory";
import { DatasetFilesBrowserInspectFile } from "@/components/dataset/view/files/inspect/content/dataset-files-browser-inspect-file";
import { DatasetFilesBrowserInspectHeader } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspect({ dataset, className, ...props }: Props) {
  const { currentEntryType } = useDatasetFilesBrowser();

  return (
    <div className={cn("flex size-full flex-col overflow-hidden", className)} {...props}>
      <DatasetFilesBrowserInspectHeader dataset={dataset} />

      {currentEntryType === "directory" ? (
        <ScrollArea className="size-full min-h-0" type="auto">
          <DatasetFilesBrowserInspectDirectory />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : (
        <ScrollArea className="size-full min-h-0" type="auto">
          <DatasetFilesBrowserInspectFile />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
}
