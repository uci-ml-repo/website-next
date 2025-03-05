"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { Expandable } from "@/components/ui/expandable";

export function DatasetAbout() {
  const { dataset } = useDataset();

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
