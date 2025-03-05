"use client";

import { PencilIcon } from "lucide-react";

import { useDatasetEdits } from "@/components/dataset/context/DatasetEditsContext";
import { Button } from "@/components/ui/button";

export function DatasetEditFieldButton() {
  const { editing } = useDatasetEdits();
  return (
    editing && (
      <Button variant="ghost" size="icon">
        <PencilIcon />
      </Button>
    )
  );
}
