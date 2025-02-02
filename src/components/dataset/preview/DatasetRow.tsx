import Image from "next/image";
import Link from "next/link";

import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

interface DatasetRowProps extends React.ComponentProps<"a"> {
  dataset: DatasetResponse;
}

export default function DatasetRow({ dataset, ...props }: DatasetRowProps) {
  return (
    <Link
      className="group flex w-full items-center space-x-2 rounded-2xl p-4 hover:bg-accent focus:bg-accent"
      href={DATASET_ROUTE(dataset)}
      {...props}
    >
      <Image
        src={DATASET_THUMBNAIL_ROUTE(dataset)}
        alt={`${dataset.title} thumbnail`}
        width={200}
        height={200}
        className="size-12 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <div className="truncate text-lg font-bold decoration-2 group-hover:underline group-focus:underline">
          {dataset.title}
        </div>
        <div className="truncate text-sm text-muted-foreground">
          {dataset.subtitle ?? dataset.description}
        </div>
      </div>
    </Link>
  );
}
