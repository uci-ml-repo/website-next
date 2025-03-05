"use client";

import { PencilIcon } from "lucide-react";

import { useDatasetEdits } from "@/components/dataset/context/DatasetEditsContext";
import { Button } from "@/components/ui/button";

export function DatasetEditButton() {
  const { editing, setEditing } = useDatasetEdits();

  return (
    !editing && (
      <Button size="lg" variant="secondary" onClick={() => setEditing(true)}>
        <PencilIcon /> Edit
      </Button>
    )
  );
}
