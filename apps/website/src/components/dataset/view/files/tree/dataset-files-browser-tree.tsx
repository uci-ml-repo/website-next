"use client";

import type { HTMLAttributes } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeHeader } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserTree({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { entryMap } = useDatasetFilesBrowser();

  const rootEntries = entryMap["/"] as Entry[];

  return (
    <div className={cn("flex size-full flex-col overflow-hidden", className)} {...props}>
      <DatasetFilesBrowserTreeHeader />
      <ScrollArea className="size-full min-h-0 p-1" type="auto">
        {rootEntries.map((entry) => (
          <DatasetFilesBrowserTreeEntry key={entry.key} entry={entry} level={1} />
        ))}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
