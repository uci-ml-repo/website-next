import path from "path";
import { useMemo } from "react";

import { FilesBrowseButton } from "@/components/dataset/tabs/files/browse/FilesBrowseButton";
import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import type { FileResponse } from "@/lib/types";

export function FilesBrowseFile({ file }: { file: FileResponse }) {
  const { currentEntry, setCurrentEntry } = useFileContext();

  const icon = useMemo(() => fileToIcon(file), [file]);

  return (
    <FilesBrowseButton
      onClick={() => setCurrentEntry(file)}
      className={currentEntry.path === file.path ? "bg-accent/50" : ""}
    >
      <div className="ic flex space-x-2">
        {icon}
        <span className="text-nowrap">{path.basename(file.path)}</span>
      </div>
    </FilesBrowseButton>
  );
}
