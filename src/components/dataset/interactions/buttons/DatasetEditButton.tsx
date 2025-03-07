"use client";

import { PencilIcon } from "lucide-react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { Button } from "@/components/ui/button";

export function DatasetEditButton() {
  const { editing, setEditing } = useDataset();

  return (
    !editing && (
      <Button
        size="lg"
        variant="secondary"
        className="lift"
        onClick={() => setEditing(true)}
      >
        <PencilIcon /> Edit
      </Button>
    )
  );
}
