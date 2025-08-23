"use client";

import type { HTMLAttributes } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectHeader } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect-header";
import { cn } from "@/lib/util/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  dataset: { id: number; slug: string };
}

export function DatasetFilesBrowserInspect({ dataset, className, ...props }: Props) {
  const { currentPath } = useDatasetFilesBrowser();

  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <DatasetFilesBrowserInspectHeader dataset={dataset} />
      <div>{currentPath}</div>
    </div>
  );
}
