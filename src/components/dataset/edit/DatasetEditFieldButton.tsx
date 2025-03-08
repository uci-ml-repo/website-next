"use client";

import { PencilIcon } from "lucide-react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface DatasetEditFieldButtonProps extends ButtonProps {}

export function DatasetEditFieldButton({
  ...props
}: DatasetEditFieldButtonProps) {
  const { editing } = useDataset();
  return (
    editing && (
      <Button variant="ghost" size="icon" className="shrink-0" {...props}>
        <PencilIcon />
      </Button>
    )
  );
}
