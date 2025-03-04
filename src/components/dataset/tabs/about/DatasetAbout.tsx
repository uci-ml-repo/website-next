import { Expandable } from "@/components/ui/expandable";
import type { DatasetResponse } from "@/lib/types";

export function DatasetAbout({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">About Dataset</h2>
      {dataset.description ? (
        <Expandable className="whitespace-pre-wrap break-words">
          {dataset.description}
        </Expandable>
      ) : (
        <div className="text-muted-foreground">No information</div>
      )}
    </div>
  );
}
