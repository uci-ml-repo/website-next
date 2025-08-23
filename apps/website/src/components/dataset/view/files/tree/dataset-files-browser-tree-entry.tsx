"use client";

import { DatasetFilesBrowserTreeEntryDirectory } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry-directory";
import { DatasetFilesBrowserTreeEntryFile } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry-file";
import type { Entry } from "@/server/service/file/find";

export type FileBrowserEntryProps = {
  entry: Entry;
  level: number;
};

export function DatasetFilesBrowserTreeEntry(props: FileBrowserEntryProps) {
  return props.entry.kind === "directory" ? (
    <DatasetFilesBrowserTreeEntryDirectory {...props} />
  ) : (
    <DatasetFilesBrowserTreeEntryFile {...props} />
  );
}
