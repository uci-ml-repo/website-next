"use client";

import { PencilIcon } from "lucide-react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { Button } from "@/components/ui/button";

export function DatasetEditFieldButton() {
  const { editing } = useDataset();
  return (
    editing && (
      <Button variant="ghost" size="icon" className="shrink-0">
        <PencilIcon />
      </Button>
    )
  );
}
