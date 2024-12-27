import type { DatasetResponse } from "@/lib/types";

export default function DatasetFiles({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  return <>{dataset.fileCount} FILES</>;
}
