import { AlertCircleIcon } from "lucide-react";
import path from "path";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { fileToIcon } from "@/components/dataset/tabs/files/lib/FileToIcon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import type { Entry } from "@/server/service/file/find";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFileViewDirectory({
  directoryEntry,
}: {
  directoryEntry: Entry;
}) {
  const { setCurrentEntry } = useFileContext();

  const { data, isLoading, isError } = trpc.file.find.list.useQuery(
    { path: directoryEntry.path ?? "" },
    {
      enabled: !!directoryEntry,
    },
  );

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
        {data.map((entry) => {
          return (
            <button
              key={entry.path}
              onClick={() => setCurrentEntry(entry)}
              className="lift h-28 w-32 shrink-0 rounded-md border"
              title={path.basename(entry.path)}
            >
              <div className="flex h-full w-full flex-col p-2">
                <div className="flex min-h-16 items-center justify-center [&>svg]:size-10">
                  {fileToIcon(entry, true)}
                </div>
                <div className="flex h-full items-end">
                  <div className="line-clamp-2 w-full overflow-hidden text-ellipsis break-all px-2 text-xs">
                    {path.basename(entry.path)}
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
