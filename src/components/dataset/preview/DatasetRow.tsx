import { Columns3Icon, Rows3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DatasetHoverCard } from "@/components/dataset/preview/DatasetHoverCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import type { DatasetPreviewResponse } from "@/lib/types";
import { abbreviateDecimal, cn } from "@/lib/utils";

interface DatasetRowProps extends React.ComponentProps<"a"> {
  dataset: DatasetPreviewResponse;
  hoverCard?: boolean;
}

type DatasetStat = {
  icon: React.ReactNode;
  text: string | null;
};

export function DatasetRow({
  dataset,
  className,
  hoverCard,
  ...props
}: DatasetRowProps) {
  const datasetStats: DatasetStat[] = [
    {
      icon: <Columns3Icon />,
      text: dataset.featureCount
        ? `${abbreviateDecimal(dataset.featureCount)} ${dataset.featureCount === 1 ? "Feature" : "Features"}`
        : null,
    },
    {
      icon: <Rows3Icon />,
      text: dataset.instanceCount
        ? `${abbreviateDecimal(dataset.instanceCount)} ${dataset.instanceCount === 1 ? "Instance" : "Instances"}`
        : null,
    },
  ];

  const row = (
    <Link
      className={cn(
        "group flex w-full items-center space-x-3 rounded-2xl p-4 @container hover:bg-accent",
        className,
      )}
      href={DATASET_ROUTE(dataset)}
      prefetch={false}
      {...props}
    >
      <Image
        src={DATASET_THUMBNAIL_ROUTE(dataset)}
        alt={`${dataset.title} thumbnail`}
        width={200}
        height={200}
        className="size-12 rounded-lg object-cover dark:brightness-90"
      />
      <div className="flex w-full items-center justify-between space-x-4 overflow-hidden">
        <div className="min-w-0">
          <div className="truncate text-xl font-bold decoration-2 group-hover:underline group-focus:underline">
            {dataset.title}
          </div>
          <div className="truncate text-sm text-muted-foreground">
            {dataset.subtitle ?? dataset.description}
          </div>
        </div>
        <div
          className={cn(
            "grid w-36 shrink-0 grid-cols-1 grid-rows-2 gap-x-4 gap-y-1 text-muted-foreground",
            "[&_svg]:size-4 [&_svg]:shrink-0",
            "hidden @md:block",
          )}
        >
          {datasetStats.map((stat, i) => {
            if (stat.text)
              return (
                <div key={i} className="flex items-center space-x-1">
                  {stat.icon}
                  <span className="text-nowrap">{stat.text}</span>
                </div>
              );
          })}
        </div>
      </div>
    </Link>
  );

  if (hoverCard) {
    return (
      <HoverCard openDelay={500} closeDelay={200}>
        <HoverCardTrigger asChild>{row}</HoverCardTrigger>
        <HoverCardContent
          className="w-[50dvw] min-w-64 max-w-xl !p-0"
          align="end"
          side="top"
        >
          <DatasetHoverCard dataset={dataset} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return row;
}
