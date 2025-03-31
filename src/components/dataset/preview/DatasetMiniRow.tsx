import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import type { DatasetPreviewSelect } from "@/db/lib/types";
import { DATASET_API_THUMBNAIL_ROUTE, DATASET_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DatasetMiniRow({
  dataset,
  showStatus,
  className,
}: {
  dataset: DatasetPreviewSelect;
  showStatus?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={DATASET_ROUTE(dataset)}
      className={cn(
        "group flex items-center space-x-2 rounded-lg p-1.5 hover:bg-accent",
        className,
      )}
    >
      <Image
        src={DATASET_API_THUMBNAIL_ROUTE(dataset)}
        alt={`${dataset.title} thumbnail`}
        height={100}
        width={100}
        className={cn("size-7 shrink-0 rounded-md object-cover dark:brightness-90")}
      />
      <div className="flex w-full min-w-0 items-center justify-between space-x-2">
        <div className="truncate text-base font-bold group-hover:underline">{dataset.title}</div>
        {showStatus && <DatasetStatusBadge status={dataset.status} />}
      </div>
    </Link>
  );
}
