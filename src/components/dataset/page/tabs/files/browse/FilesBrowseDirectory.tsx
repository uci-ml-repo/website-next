import { useEffect, useMemo, useState } from "react";

import FilesBrowseButton from "@/components/dataset/page/tabs/files/browse/FilesBrowseButton";
import FilesBrowseFile from "@/components/dataset/page/tabs/files/browse/FilesBrowseFile";
import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import directoryEntityToIcon from "@/components/dataset/page/tabs/files/lib/DirectoryEntityToIcon";
import Spinner from "@/components/ui/spinner";
import type { FileResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowseDirectory({
  directory,
}: {
  directory: FileResponse;
}) {
  const { currentDirectoryEntity, setCurrentDirectoryEntity } =
    useCurrentDirectoryEntity();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentDirectoryEntity.path.startsWith(directory.path + "/")) {
      setIsExpanded(true);
    }
  }, [currentDirectoryEntity.path, directory.path, isExpanded]);

  const directoryQuery = trpc.files.find.list.useQuery(
    {
      path: directory.path,
    },
    {
      enabled: isExpanded,
    },
  );

  const icon = useMemo(() => directoryEntityToIcon(directory), [directory]);

  return (
    <div>
      <FilesBrowseButton
        chevron
        chevronDown={isExpanded}
        className={
          currentDirectoryEntity.path === directory.path ? "bg-accent/50" : ""
        }
        onClick={() => {
          setCurrentDirectoryEntity(directory);
          setIsExpanded((prev) => !prev);
        }}
      >
        {icon}
        <span>{directory.name}</span>
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
