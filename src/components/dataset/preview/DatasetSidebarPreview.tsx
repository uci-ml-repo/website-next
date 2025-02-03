"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DatasetSelect } from "@/db/types";
import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function DatasetSidebarPreview({
  dataset,
}: {
  dataset: DatasetSelect;
}) {
  const pathname = usePathname();
  const datasetRoute = DATASET_ROUTE(dataset);
  const isActive = pathname.startsWith(datasetRoute);

  return (
    <li>
      <Link
        href={datasetRoute}
        className={cn(
          "flex items-center space-x-2 rounded-lg p-2 hover:bg-sidebar-accent",
          {
            "bg-sidebar-accent": isActive,
          },
        )}
      >
        <Image
          src={DATASET_THUMBNAIL_ROUTE(dataset)}
          alt={`${dataset.title} thumbnail`}
          height={100}
          width={100}
          className="size-7 rounded-lg object-cover"
        />
        <div className="flex w-full min-w-0 items-center justify-between space-x-1">
          <div className="truncate text-base font-bold">{dataset.title}</div>
          {isActive && (
            <div className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />
          )}
        </div>
      </Link>
    </li>
  );
}
