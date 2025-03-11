"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { DatasetDescriptionForm } from "@/components/dataset/tabs/about/sections/description/DatasetDescriptionForm";
import { MDXViewer } from "@/components/editor/MDXViewer";
import { Expandable } from "@/components/ui/expandable";

export function DatasetDescription() {
  const { dataset, editingFields } = useDataset();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <h2 className="text-2xl font-bold">About Dataset</h2>
        <DatasetEditFieldButton
          field="description"
          aria-label="Edit dataset description"
        />
      </div>
      {editingFields["description"] ? (
        <DatasetDescriptionForm />
      ) : dataset.description ? (
        <Expandable className="whitespace-pre-wrap break-words">
          <MDXViewer markdown={dataset.description} />
          {/*{dataset.description}*/}
        </Expandable>
      ) : (
        <div className="text-muted-foreground">No information</div>
      )}
    </div>
  );
}
