"use client";

import type { HTMLAttributes } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeHeader } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";

export function DatasetFilesBrowserTree({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { directoryMap } = useDatasetFilesBrowser();

  const rootEntries = directoryMap["/"];

  return (
    <div className={cn("flex size-full flex-col overflow-hidden", className)} {...props}>
      <DatasetFilesBrowserTreeHeader />
      <ScrollArea className="size-full min-h-0" type="auto" vertical horizontal>
        <div className="p-1 pb-6">
          {rootEntries.map((entry) => (
            <DatasetFilesBrowserTreeEntry key={entry.key} entry={entry} level={1} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
