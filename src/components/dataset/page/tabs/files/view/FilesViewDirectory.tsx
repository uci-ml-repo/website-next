import { useCurrentDirectoryEntity } from "@/components/dataset/page/tabs/files/FilesContext";
import directoryEntityToIcon from "@/components/dataset/page/tabs/files/lib/DirectoryEntityToIcon";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export default function FilesViewDirectory({
  directoryPath,
}: {
  directoryPath?: string;
}) {
  const { setCurrentDirectoryEntity } = useCurrentDirectoryEntity();

  const { data, isLoading, isError } = trpc.files.find.list.useQuery(
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
    return <div className="p-4">Error loading directory.</div>;
  }

  return (
    <div className="flex h-fit flex-wrap gap-2 overflow-auto p-4">
      {data.map((directoryEntity) => {
        return (
          <button
            key={directoryEntity.path}
            onClick={() => setCurrentDirectoryEntity(directoryEntity)}
            className="h-28 w-32 rounded-md border"
          >
            <div className="flex items-center justify-center [&>svg]:size-10">
              {directoryEntityToIcon(directoryEntity, true)}
            </div>
            <div className="line-clamp-2 px-2 text-sm">
              {directoryEntity.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}
