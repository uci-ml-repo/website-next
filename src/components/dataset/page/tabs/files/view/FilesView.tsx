import { useCurrentPath } from "@/components/dataset/page/tabs/files/FilesContext";
import type { DatasetResponse } from "@/lib/types";

export default function FilesView({ dataset }: { dataset: DatasetResponse }) {
  const { currentPath } = useCurrentPath();

  return <div>{currentPath?.path}</div>;
}
