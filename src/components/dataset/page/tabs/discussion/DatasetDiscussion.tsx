import type { DatasetResponse } from "@/lib/types";

export default function DatasetDiscussion({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  console.log(dataset);

  return <>DISCUSSION</>;
}
