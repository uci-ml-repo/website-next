import { Input } from "@/components/ui/input";
import type { DatasetResponse } from "@/lib/types";

export function DatasetSettingsTitle({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  console.log(dataset);

  return (
    <div>
      <Input />
    </div>
  );
}
