import path from "path";
import { useEffect, useMemo, useState } from "react";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import { DatasetFileTreeButton } from "@/components/dataset/tabs/files/tree/DatasetFileTreeButton";
import { DatasetFileTreeFile } from "@/components/dataset/tabs/files/tree/DatasetFileTreeFile";
import { Spinner } from "@/components/ui/spinner";
import type { Entry } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFileTreeDirectory({ directory }: { directory: Entry }) {
  const { currentEntry, setCurrentEntry } = useFileContext();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentEntry.path.startsWith(directory.path + "/")) {
      setIsExpanded(true);
    }
  }, [currentEntry.path, directory.path]);

  const directoryQuery = trpc.file.find.list.useQuery(
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
      <DatasetFileTreeButton
        chevron
        chevronDown={isExpanded}
        className={currentEntry.path === directory.path ? "bg-accent/50" : ""}
        onClick={() => {
          setCurrentEntry(directory);
          setIsExpanded((prev) => !prev);
        }}
      >
        {icon}
        <span>{path.basename(directory.path)}</span>
      </DatasetFileTreeButton>

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
                      <DatasetFileTreeDirectory
                        key={directoryEntity.path}
                        directory={directoryEntity}
                      />
                    );
                  } else if (directoryEntity.type === "file") {
                    return (
                      <DatasetFileTreeFile
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
