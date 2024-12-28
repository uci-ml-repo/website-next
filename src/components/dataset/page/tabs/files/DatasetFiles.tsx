import type { DatasetResponse } from "@/lib/types";

export default function DatasetFiles({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Files</h2>
      <div>{dataset.fileCount}</div>
    </div>
  );
}
