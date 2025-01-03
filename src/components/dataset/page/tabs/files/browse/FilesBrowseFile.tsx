import { useMemo } from "react";

import FilesBrowseButton from "@/components/dataset/page/tabs/files/browse/FilesBrowseButton";
import { useFileContext } from "@/components/dataset/page/tabs/files/FilesContext";
import fileToIcon from "@/components/dataset/page/tabs/files/lib/FileToIcon";
import type { FileResponse } from "@/lib/types";

export default function FilesBrowseFile({ file }: { file: FileResponse }) {
  const { currentFile, setCurrentFile } = useFileContext();

  const icon = useMemo(() => fileToIcon(file), [file]);

  return (
    <FilesBrowseButton
      onClick={() => setCurrentFile(file)}
      className={currentFile.path === file.path ? "bg-accent/50" : ""}
    >
      <div className="ic flex space-x-2">
        {icon}
        <span className="text-nowrap">{file.name}</span>
      </div>
    </FilesBrowseButton>
  );
}
