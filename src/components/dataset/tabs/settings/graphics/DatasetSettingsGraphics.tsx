"use client";

import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetSettingsGraphicsDialog } from "@/components/dataset/tabs/settings/graphics/DatasetSettingsGraphicsDialog";
import { AlertInfo } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DATASET_API_THUMBNAIL_PENDING_ROUTE,
  DATASET_API_THUMBNAIL_ROUTE,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DatasetSettingsGraphics() {
  const { dataset } = useDataset();
  const { hasPendingThumbnail } = useDatasetFileStatus();
  const [thumbnailParam, setThumbnailParam] = React.useState<number>(0);

  function resetThumbnail() {
    setThumbnailParam(Date.now());
  }

  return (
    <div className="space-y-1">
      <h3 className="text-xl font-bold">Thumbnail</h3>
      <div className="space-y-2">
        <div className="text-muted-foreground">
          Add an image to appear with your dataset (275 x 100).
        </div>
        {!!thumbnailParam && (
          <AlertInfo className="w-fit">
            Thumbnail updated. Changes may take several minutes to reflect on
            your dataset.
          </AlertInfo>
        )}
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              hasPendingThumbnail
                ? DATASET_API_THUMBNAIL_PENDING_ROUTE({
                    ...dataset,
                    fallback: false,
                  }) + `?${thumbnailParam}`
                : DATASET_API_THUMBNAIL_ROUTE(dataset) + `?${thumbnailParam}`
            }
            alt={`${dataset.title} thumbnail`}
            width={275}
            height={100}
            className={cn(
              "h-[100px] w-[275px] shrink-0",
              "rounded-2xl border-2 object-cover object-center dark:brightness-90",
            )}
          />
          {hasPendingThumbnail && (
            <div className="absolute right-2 top-2">
              <Badge variant="gold-strong">PENDING</Badge>
            </div>
          )}
          {!dataset.hasGraphics && !hasPendingThumbnail && (
            <div className="absolute right-2 top-2">
              <Badge variant="gold-strong">DEFAULT</Badge>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <DatasetSettingsGraphicsDialog resetThumbnail={resetThumbnail} />
        </div>
      </div>
    </div>
  );
}
