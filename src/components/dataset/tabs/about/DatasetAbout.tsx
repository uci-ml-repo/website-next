import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { Expandable } from "@/components/ui/expandable";
import type { DatasetResponse } from "@/lib/types";

export function DatasetAbout({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div>
      <div className="flex items-center space-x-1">
        <h2 className="text-2xl font-bold">About Dataset</h2>
        <DatasetEditFieldButton />
      </div>
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
