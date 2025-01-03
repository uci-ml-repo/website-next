import { useMemo } from "react";

import FilesBrowseButton from "@/components/dataset/page/tabs/files/browse/FilesBrowseButton";
import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import directoryEntityToIcon from "@/components/dataset/page/tabs/files/lib/DirectoryEntityToIcon";
import type { FileResponse } from "@/lib/types";

export default function FilesBrowseFile({ file }: { file: FileResponse }) {
  const { currentDirectoryEntity, setCurrentDirectoryEntity } =
    useCurrentDirectoryEntity();

  const icon = useMemo(() => directoryEntityToIcon(file), [file]);

  return (
    <FilesBrowseButton
      onClick={() => setCurrentDirectoryEntity(file)}
      className={
        currentDirectoryEntity.path === file.path ? "bg-accent/50" : ""
      }
    >
      <div className="ic flex space-x-2">
        {icon}
        <span className="text-nowrap">{file.name}</span>
      </div>
    </FilesBrowseButton>
  );
}
