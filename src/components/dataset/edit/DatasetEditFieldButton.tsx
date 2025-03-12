"use client";

import { PencilIcon } from "lucide-react";

import type { DatasetField } from "@/components/dataset/context/DatasetContext";
import { useDataset } from "@/components/dataset/context/DatasetContext";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatasetEditFieldButtonProps extends ButtonProps {
  alwaysVisible?: boolean;
  children?: never;
  field: DatasetField;
}

export function DatasetEditFieldButton({
  alwaysVisible,
  field,
  className,
  onClick,
  ...props
}: DatasetEditFieldButtonProps) {
  const { startEditingField, editingFields, editing } = useDataset();

  return (
    !editingFields[field] &&
    (editing || alwaysVisible) && (
      <Button
        variant="ghost"
        size="icon"
        className={cn("shrink-0", className)}
        onClick={(event) => {
          startEditingField(field);
          if (onClick) onClick(event);
        }}
        {...props}
      >
        <PencilIcon />
      </Button>
    )
  );
}
