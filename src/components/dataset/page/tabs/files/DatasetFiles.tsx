import type { DatasetResponse } from "@/lib/types";

export default function DatasetFiles({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  console.log(dataset);

  return <>FILES</>;
}
