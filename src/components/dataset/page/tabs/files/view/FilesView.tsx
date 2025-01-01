import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesDirectory } from "@/lib/utils";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentPath } = useCurrentPath();

  return (
    <div>
      {currentPath?.path.slice(datasetFilesDirectory(dataset).length + 1)}
    </div>
  );
}
