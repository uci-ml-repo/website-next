import { FolderIcon } from "lucide-react";
import { useEffect, useState } from "react";

import FilesBrowseButton from "@/components/dataset/page/tabs/files/browse/FilesBrowseButton";
import FilesBrowseFile from "@/components/dataset/page/tabs/files/browse/FilesBrowseFile";
import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import Spinner from "@/components/ui/spinner";
import type { FileResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function FilesBrowseDirectory({
  node,
  parentExpanded = true,
  setParentExpanded,
}: {
  node: FileResponse;
  parentExpanded?: boolean;
  setParentExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { currentPath, setCurrentPath } = useCurrentPath();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!parentExpanded && isExpanded) {
      if (currentPath?.path === node.path && setParentExpanded) {
        setParentExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  }, [
    parentExpanded,
    isExpanded,
    currentPath?.path,
    node.path,
    setParentExpanded,
  ]);

  const directoryQuery = trpc.files.find.list.useQuery(
    {
      path: node.path,
    },
    {
      enabled: isExpanded,
    },
  );

  return (
    <div>
      <FilesBrowseButton
        chevron
        chevronDown={isExpanded}
        className={currentPath?.path === node.path ? "bg-accent/50" : ""}
        onClick={() => {
          setCurrentPath(node);
          setIsExpanded(!isExpanded);
        }}
      >
        <FolderIcon className="fill-foreground" />
        <span>{node.name}</span>
      </FilesBrowseButton>

      {isExpanded && (
        <div className="flex">
          <div className="ml-3 mr-1 border" />

          {directoryQuery.isLoading ? (
            <Spinner className="ml-6" />
          ) : (
            <div className={cn("w-full", isExpanded ? "" : "hidden")}>
              {directoryQuery.data &&
                directoryQuery.data.map((node) => {
                  if (node.type === "directory") {
                    return (
                      <FilesBrowseDirectory
                        key={node.path}
                        node={node}
                        parentExpanded={isExpanded}
                        setParentExpanded={setParentExpanded}
                      />
                    );
                  } else if (node.type === "file") {
                    return <FilesBrowseFile node={node} key={node.path} />;
                  }
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
