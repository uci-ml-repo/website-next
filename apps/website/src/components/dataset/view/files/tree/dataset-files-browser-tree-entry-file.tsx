"use client";

import { FileIcon } from "@primer/octicons-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import type { FileBrowserEntryProps } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeEntryButton } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry-button";

export function DatasetFilesBrowserTreeEntryFile({ entry, level }: FileBrowserEntryProps) {
  const { currentPath } = useDatasetFilesBrowser();

  return (
    <DatasetFilesBrowserTreeEntryButton
      entry={entry}
      level={level}
      active={currentPath === entry.key}
    >
      <FileIcon className="text-muted-foreground" /> {entry.basename}
    </DatasetFilesBrowserTreeEntryButton>
  );
}
