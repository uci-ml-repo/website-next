"use client";

import { FileDirectoryFillIcon, FileDirectoryOpenFillIcon } from "@primer/octicons-react";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserEntryButton } from "@/components/dataset/view/files/tree/dataset-files-browser-entry-button";
import type { FileBrowserEntryProps } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import type { Entry } from "@/server/service/file/find";

export function DatasetFilesBrowserTreeEntryDirectory({
  entry,
  level,
  parent,
}: FileBrowserEntryProps) {
  const { entryMap, currentPath } = useDatasetFilesBrowser();
  const [open, setOpen] = useState(currentPath.startsWith(entry.key));

  const children = entryMap[entry.key] as Entry[];
  const displayName = parent ? entry.key.substring(parent.key.length + 1) : entry.key;
  const active = currentPath === entry.key;

  useEffect(() => {
    if (!active && currentPath === entry.key) {
      setOpen(true);
    }
  }, [active, currentPath, entry.key]);

  return (
    <>
      <DatasetFilesBrowserEntryButton
        entry={entry}
        onClick={() =>
          setOpen((prev) => {
            if (!active && prev) return true;
            return !prev;
          })
        }
        active={currentPath === entry.key}
        level={level}
        aria-expanded={open}
        className="group relative"
      >
        <ChevronRightIcon
          className="text-muted-foreground absolute size-3.5 group-aria-[expanded=true]:rotate-90"
          style={{ left: level * 10 - 6 }}
        />
        {open ? (
          <FileDirectoryOpenFillIcon className="text-muted-foreground" />
        ) : (
          <FileDirectoryFillIcon className="text-muted-foreground" />
        )}
        {displayName}
      </DatasetFilesBrowserEntryButton>
      {open && (
        <div className="relative w-max min-w-full">
          {children?.map((child) => (
            <DatasetFilesBrowserTreeEntry
              key={child.key}
              entry={child}
              parent={entry}
              level={level + 1}
            />
          ))}
          <div className="bg-border absolute top-0 h-full w-[1px]" style={{ left: level * 10 }} />
        </div>
      )}
    </>
  );
}
