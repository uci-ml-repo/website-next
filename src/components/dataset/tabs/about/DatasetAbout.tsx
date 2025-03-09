"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { MDXEditor } from "@/components/editor/MDXEditor";
import { Button } from "@/components/ui/button";
import { Expandable } from "@/components/ui/expandable";

export function DatasetAbout() {
  const { dataset, startEditingField, stopEditingField, editingFields } =
    useDataset();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <h2 className="text-2xl font-bold">About Dataset</h2>
        {!editingFields["about"] && (
          <DatasetEditFieldButton onClick={() => startEditingField("about")} />
        )}
      </div>
      {editingFields["about"] ? (
        <div className="space-y-2">
          <MDXEditor markdown={dataset.description ?? ""} />
          <div className="flex items-center justify-end space-x-2">
            <Button
              onClick={() => stopEditingField("about")}
              variant="secondary"
              className="lift"
            >
              Cancel
            </Button>
            <Button onClick={() => stopEditingField("about")} className="lift">
              Save
            </Button>
          </div>
        </div>
      ) : dataset.description ? (
        <Expandable className="whitespace-pre-wrap break-words">
          {dataset.description}
        </Expandable>
      ) : (
        <div className="text-muted-foreground">No information</div>
      )}
    </div>
  );
}
