import type { DatasetResponse } from "@/lib/types";

export default function DatasetRow({ dataset }: { dataset: DatasetResponse }) {
  return <div>{dataset.title}</div>;
}
