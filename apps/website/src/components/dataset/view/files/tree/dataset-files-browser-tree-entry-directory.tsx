"use client";

import { FileDirectoryFillIcon, FileDirectoryOpenFillIcon } from "@primer/octicons-react";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import type { FileBrowserEntryProps } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeEntry } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry";
import { DatasetFilesBrowserTreeEntryButton } from "@/components/dataset/view/files/tree/dataset-files-browser-tree-entry-button";

export function DatasetFilesBrowserTreeEntryDirectory({ entry, level }: FileBrowserEntryProps) {
  const { directoryMap, currentPath } = useDatasetFilesBrowser();
  const [open, setOpen] = useState(currentPath.startsWith(entry.key));

  const children = useMemo(() => directoryMap[entry.key], [directoryMap, entry.key]);

  const [active, setActive] = useState(currentPath === entry.key);

  useEffect(() => {
    if (currentPath.startsWith(entry.key)) {
      setOpen(true);
    }
    setActive(currentPath === entry.key);
  }, [currentPath, entry.key]);

  return (
    <>
      <DatasetFilesBrowserTreeEntryButton
        entry={entry}
        onClick={() =>
          setOpen((prev) => {
            if (!active && prev) return true;
            return !prev;
          })
        }
        active={active}
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
        {entry.basename}
      </DatasetFilesBrowserTreeEntryButton>
      {open && (
        <div className="relative w-max min-w-full">
          {children?.map((child) => (
            <DatasetFilesBrowserTreeEntry key={child.key} entry={child} level={level + 1} />
          ))}
          <div className="bg-border absolute top-0 h-full w-[1px]" style={{ left: level * 10 }} />
        </div>
      )}
    </>
  );
}
