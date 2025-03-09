import React from "react";

import { DatasetSettingsGraphicsDialog } from "@/components/dataset/tabs/settings/graphics/DatasetSettingsGraphicsDialog";

export function DatasetSettingsGraphics() {
  return (
    <div className="space-y-1">
      <h3 className="text-xl font-bold">Thumbnail</h3>
      <div className="text-muted-foreground">
        Add an image to appear with your dataset.
      </div>
      <DatasetSettingsGraphicsDialog />
    </div>
  );
}
