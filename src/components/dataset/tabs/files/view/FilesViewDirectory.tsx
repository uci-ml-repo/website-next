import { AlertCircleIcon } from "lucide-react";
import path from "path";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export function FilesViewDirectory({
  directoryPath,
}: {
  directoryPath?: string;
}) {
  const { setCurrentFile } = useFileContext();

  const { data, isLoading, isError } = trpc.file.find.list.useQuery(
    { path: directoryPath ?? "" },
    {
      enabled: !!directoryPath,
    },
  );

  if (!directoryPath) {
    return <div className="p-4">No directory selected</div>;
  }

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="m-4">
        <div className="flex items-center space-x-2">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>Error loading directory</AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-wrap gap-2 p-4">
        {data.map((directoryEntity) => {
          return (
            <button
              key={directoryEntity.path}
              onClick={() => setCurrentFile(directoryEntity)}
              className="lift h-28 w-32 shrink-0 rounded-md border"
              title={path.basename(directoryEntity.path)}
            >
              <div className="flex h-full w-full flex-col p-2">
                <div className="flex min-h-16 items-center justify-center [&>svg]:size-10">
                  {fileToIcon(directoryEntity, true)}
                </div>
                <div className="flex h-full items-end">
                  <div className="line-clamp-2 w-full overflow-hidden text-ellipsis break-all px-2 text-xs">
                    {path.basename(directoryEntity.path)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
