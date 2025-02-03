import {
  CalendarDaysIcon,
  Columns3Icon,
  EyeIcon,
  Rows3Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DatasetCardContent } from "@/components/dataset/preview/DatasetCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateDecimal, cn } from "@/lib/utils";

interface DatasetRowProps extends React.ComponentProps<"a"> {
  dataset: DatasetResponse;
  hoverCard?: boolean;
}

export default function DatasetRow({
  dataset,
  className,
  hoverCard,
  ...props
}: DatasetRowProps) {
  const row = (
    <Link
      className={cn(
        "group flex w-full items-center space-x-2 rounded-2xl p-4 hover:bg-accent focus:bg-accent",
        className,
      )}
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
      <div className="flex w-full items-center justify-between space-x-4 overflow-hidden">
        <div className="min-w-0">
          <div className="truncate text-lg font-bold decoration-2 group-hover:underline group-focus:underline">
            {dataset.title}
          </div>
          <div className="truncate text-sm text-muted-foreground">
            {dataset.subtitle ?? dataset.description}
          </div>
        </div>
        <div
          className={cn(
            "grid shrink-0 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 text-muted-foreground",
            "*:flex *:items-center *:space-x-1 [&_span]:text-nowrap [&_svg]:size-4 [&_svg]:shrink-0",
          )}
        >
          <div>
            <EyeIcon className="size-4" />
            <span>{abbreviateDecimal(dataset.viewCount)}</span>
          </div>
          {dataset.yearCreated && (
            <div>
              <CalendarDaysIcon />
              <span>{dataset.yearCreated}</span>
            </div>
          )}
          {dataset.featureCount && (
            <div>
              <Columns3Icon />
              <span>{abbreviateDecimal(dataset.featureCount)}</span>
            </div>
          )}
          {dataset.instanceCount && (
            <div>
              <Rows3Icon />
              <span>{abbreviateDecimal(dataset.instanceCount)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  if (hoverCard) {
    return (
      <HoverCard openDelay={300}>
        <HoverCardTrigger asChild>{row}</HoverCardTrigger>
        <HoverCardContent className="w-[50dvw] min-w-64 max-w-xl" align="end">
          <DatasetCardContent
            dataset={dataset}
            descriptionClassName="line-clamp-4 text-base"
          />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return row;
}
