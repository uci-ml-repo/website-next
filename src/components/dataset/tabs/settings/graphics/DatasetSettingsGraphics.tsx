"use client";

import Image from "next/image";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetSettingsGraphicsDialog } from "@/components/dataset/tabs/settings/graphics/DatasetSettingsGraphicsDialog";
import { Badge } from "@/components/ui/badge";
import {
  DATASET_API_THUMBNAIL_PENDING_ROUTE,
  DATASET_API_THUMBNAIL_ROUTE,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DatasetSettingsGraphics() {
  const { dataset } = useDataset();
  const { hasPendingThumbnail } = useDatasetFileStatus();

  return (
    <div className="space-y-1">
      <h3 className="text-xl font-bold">Thumbnail</h3>
      <div className="space-y-2">
        <div className="text-muted-foreground">
          Add an image to appear with your dataset ().
        </div>
        <div className="relative w-fit">
          <Image
            src={
              hasPendingThumbnail
                ? DATASET_API_THUMBNAIL_PENDING_ROUTE(dataset)
                : DATASET_API_THUMBNAIL_ROUTE(dataset)
            }
            alt={`${dataset.title} thumbnail`}
            width={275}
            height={100}
            className={cn(
              "h-[100px] w-[275px] shrink-0",
              "rounded-2xl border-2 object-cover object-center dark:brightness-90 max-2lg:hidden",
            )}
          />
          {hasPendingThumbnail && (
            <div className="absolute right-2 top-2">
              <Badge variant="gold-strong">PENDING</Badge>
            </div>
          )}
        </div>
        <DatasetSettingsGraphicsDialog />
      </div>
    </div>
  );
}
