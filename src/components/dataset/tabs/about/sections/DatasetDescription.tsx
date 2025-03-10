"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { MDXEditor } from "@/components/editor/MDXEditor";
import { Button } from "@/components/ui/button";
import { Expandable } from "@/components/ui/expandable";

export function DatasetDescription() {
  const {
    dataset,
    setDataset,
    startEditingField,
    stopEditingField,
    editingFields,
  } = useDataset();

  const ref = useRef<MDXEditorMethods>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <h2 className="text-2xl font-bold">About Dataset</h2>
        {!editingFields["description"] && (
          <DatasetEditFieldButton
            onClick={() => startEditingField("description")}
          />
        )}
      </div>
      {editingFields["description"] ? (
        <div className="space-y-2">
          <MDXEditor markdown={dataset.description ?? ""} ref={ref} />
          <div className="flex items-center justify-end space-x-2">
            <Button
              onClick={() => stopEditingField("description")}
              variant="secondary"
              className="lift"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDataset({
                  ...dataset,
                  description: ref.current?.getMarkdown() ?? null,
                });
                stopEditingField("description");
              }}
              className="lift"
            >
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
