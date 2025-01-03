import path from "path";
import { useEffect, useMemo, useState } from "react";

import FilesBrowseButton from "@/components/dataset/page/tabs/files/browse/FilesBrowseButton";
import FilesBrowseFile from "@/components/dataset/page/tabs/files/browse/FilesBrowseFile";
import { useFileContext } from "@/components/dataset/page/tabs/files/FilesContext";
import fileToIcon from "@/components/dataset/page/tabs/files/lib/FileToIcon";
import Spinner from "@/components/ui/spinner";
import type { FileResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowseDirectory({
  directory,
}: {
  directory: FileResponse;
}) {
  const { currentFile, setCurrentFile } = useFileContext();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentFile.path.startsWith(directory.path + "/")) {
      setIsExpanded(true);
    }
  }, [currentFile.path, directory.path]);

  const directoryQuery = trpc.files.find.list.useQuery(
    {
      path: directory.path,
    },
    {
      enabled: isExpanded,
    },
  );

  const icon = useMemo(() => fileToIcon(directory), [directory]);

  return (
    <div>
      <FilesBrowseButton
        chevron
        chevronDown={isExpanded}
        className={currentFile.path === directory.path ? "bg-accent/50" : ""}
        onClick={() => {
          setCurrentFile(directory);
          setIsExpanded((prev) => !prev);
        }}
      >
        {icon}
        <span>{path.basename(directory.path)}</span>
      </FilesBrowseButton>

      {isExpanded && (
        <div className="flex">
          <div className="ml-3 mr-1 border" />

          {directoryQuery.isLoading ? (
            <Spinner className="ml-6" />
          ) : (
            <div className="w-full">
              {directoryQuery.data &&
                directoryQuery.data.map((directoryEntity) => {
                  if (directoryEntity.type === "directory") {
                    return (
                      <FilesBrowseDirectory
                        key={directoryEntity.path}
                        directory={directoryEntity}
                      />
                    );
                  } else if (directoryEntity.type === "file") {
                    return (
                      <FilesBrowseFile
                        file={directoryEntity}
                        key={directoryEntity.path}
                      />
                    );
                  }
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
