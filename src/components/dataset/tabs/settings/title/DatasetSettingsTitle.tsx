"use client";

import React, { useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { DatasetSettingsTitleForm } from "@/components/dataset/tabs/settings/title/DatasetSettingsTitleForm";

export function DatasetSettingsTitle() {
  const { dataset, editing, setEditing } = useDataset();
  const [editingTitle, setEditingTitle] = useState<boolean>(false);

  return (
    <div className="space-y-1">
      <h3 className="text-xl font-bold">Dataset Title</h3>

      {editingTitle ? (
        <DatasetSettingsTitleForm setEditingTitle={setEditingTitle} />
      ) : (
        <div className="flex items-center space-x-1">
          <div className="text-lg">{dataset.title}</div>
          <DatasetEditFieldButton
            alwaysVisible
            onClick={() => {
              if (!editing) {
                setEditing(true);
              }
              setEditingTitle(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
