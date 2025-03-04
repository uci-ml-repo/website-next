import path from "path";
import { useMemo } from "react";

import { useDatasetFiles } from "@/components/dataset/tabs/files/DatasetFilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import { DatasetFileTreeButton } from "@/components/dataset/tabs/files/tree/DatasetFileTreeButton";
import type { Entry } from "@/server/service/file/find";

export function DatasetFileTreeFile({
  file,
  displayFullPath,
}: {
  file: Entry;
  displayFullPath?: boolean;
}) {
  const { currentEntry, setCurrentEntry, rootPath } = useDatasetFiles();

  const icon = useMemo(() => fileToIcon(file), [file]);

  const dirName = path.dirname(file.path).slice(rootPath.length + 1);
  const fileName = path.basename(file.path);

  return (
    <DatasetFileTreeButton
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
    </DatasetFileTreeButton>
  );
}
