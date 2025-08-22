"use client";

import { FileIcon } from "@primer/octicons-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserEntryButton } from "@/components/dataset/view/files/tree/dataset-files-browser-entry-button";
import type { FileBrowserEntryProps } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";

export function DatasetFilesBrowserTreeEntryFile({ entry, level, parent }: FileBrowserEntryProps) {
  const { currentPath } = useDatasetFilesBrowser();

  const displayName = parent ? entry.key.substring(parent.key.length + 1) : entry.key;

  return (
    <DatasetFilesBrowserEntryButton entry={entry} active={currentPath === entry.key} level={level}>
      <FileIcon className="text-muted-foreground" /> {displayName}
    </DatasetFilesBrowserEntryButton>
  );
}
