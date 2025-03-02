import path from "path";
import { useMemo } from "react";

import { FilesBrowseButton } from "@/components/dataset/tabs/files/browse/FilesBrowseButton";
import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import type { Entry } from "@/server/service/file/find";

export function FilesBrowseFile({
  file,
  displayFullPath,
}: {
  file: Entry;
  displayFullPath?: boolean;
}) {
  const { currentEntry, setCurrentEntry, rootPath } = useFileContext();

  const icon = useMemo(() => fileToIcon(file), [file]);

  const dirName = path.dirname(file.path).slice(rootPath.length + 1);
  const fileName = path.basename(file.path);

  return (
    <FilesBrowseButton
      onClick={() => setCurrentEntry(file)}
      className={currentEntry.path === file.path ? "bg-accent/50" : ""}
    >
      <div className="ic flex space-x-2">
        {icon}
        <span className="text-nowrap">
          {displayFullPath && dirName && (
            <span className="text-muted-foreground">{dirName + "/"}</span>
          )}
          <span>{fileName}</span>
        </span>
      </div>
    </FilesBrowseButton>
  );
}
