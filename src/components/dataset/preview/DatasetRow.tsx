import Image from "next/image";
import Link from "next/link";

import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export default function DatasetRow({ dataset }: { dataset: DatasetResponse }) {
  return (
    <Link
      tabIndex={-1}
      className="hover:bg-accent-1 group flex w-full items-center space-x-2 rounded-2xl p-4"
      href={DATASET_ROUTE(dataset)}
    >
      <Image
        src={DATASET_THUMBNAIL_ROUTE(dataset)}
        alt={`${dataset.title} thumbnail`}
        width={200}
        height={200}
        className="size-12 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <div className="truncate text-lg font-bold decoration-2 group-hover:underline">
          {dataset.title}
        </div>
        <div className="truncate text-sm text-muted-foreground">
          {dataset.subtitle ?? dataset.description}
        </div>
      </div>
    </Link>
  );
}
