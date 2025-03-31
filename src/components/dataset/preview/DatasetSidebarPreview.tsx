"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DatasetPreviewSelect } from "@/db/lib/types";
import { DATASET_API_THUMBNAIL_ROUTE, DATASET_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface DatasetSidebarPreviewProps extends React.ComponentProps<"a"> {
  dataset: DatasetPreviewSelect;
}

export function DatasetSidebarPreview({
  dataset,
  className,
  ...props
}: DatasetSidebarPreviewProps) {
  const pathname = usePathname();
  const datasetRoute = DATASET_ROUTE(dataset);
  const isActive = pathname.startsWith(datasetRoute);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={datasetRoute}
          className={cn(
            "group/dataset ml-1 flex items-center rounded-lg p-1.5 hover:bg-sidebar-accent",
            { "bg-sidebar-accent": isActive },
            className,
          )}
          {...props}
        >
          <Image
            src={DATASET_API_THUMBNAIL_ROUTE(dataset)}
            alt={`${dataset.title} thumbnail`}
            height={100}
            width={100}
            className={cn("size-7 shrink-0 rounded-md object-cover dark:brightness-90")}
          />
          <div className="ml-2 flex w-full min-w-0 items-center justify-between space-x-1">
            <div className="truncate text-base font-bold group-hover/dataset:underline">
              {dataset.title}
            </div>
            {isActive && <div className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />}
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-base">
        {dataset.title}
      </TooltipContent>
    </Tooltip>
  );
}
