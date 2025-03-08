"use client";

import { PencilIcon } from "lucide-react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatasetEditFieldButtonProps extends ButtonProps {
  alwaysVisible?: boolean;
  children?: never;
}

export function DatasetEditFieldButton({
  alwaysVisible,
  className,
  ...props
}: DatasetEditFieldButtonProps) {
  const { editing } = useDataset();

  return (
    (editing || alwaysVisible) && (
      <Button
        variant="ghost"
        size="icon"
        className={cn("shrink-0", className)}
        {...props}
      >
        <PencilIcon />
      </Button>
    )
  );
}
