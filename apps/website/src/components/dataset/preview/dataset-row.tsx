import { Columns3Icon, Rows3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ROUTES } from "@/lib/routes";
import { abbreviateDecimal } from "@/lib/util/abbreviate";
import { cn } from "@/lib/util/cn";
import type { DatasetSelect } from "@/server/types/dataset/response";

import { DatasetHoverCard } from "./dataset-hover-card";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  dataset: DatasetSelect;
  hoverCard?: boolean;
};

export function DatasetRow({ dataset, className, hoverCard, ...props }: Props) {
  const datasetStats = [
    {
      icon: <Columns3Icon />,
      text:
        dataset.featureCount !== null
          ? `${abbreviateDecimal(dataset.featureCount)} Feature${dataset.featureCount === 1 ? "" : "s"}`
          : null,
    },
    {
      icon: <Rows3Icon />,
      text:
        dataset.instanceCount !== null
          ? `${abbreviateDecimal(dataset.instanceCount)} Instance${dataset.instanceCount === 1 ? "" : "s"}`
          : null,
    },
  ];

  const row = (
    <Link
      className={cn(
        "group @container flex w-full !cursor-pointer items-center space-x-3 !p-4",
        "hover:bg-accent focus-visible:bg-accent",
        className,
      )}
      {...props}
      href={ROUTES.DATASET(dataset)}
    >
      <Image
        src={ROUTES.DATASET.THUMBNAIL(dataset)}
        alt={`${dataset.title} thumbnail`}
        width={200}
        height={48}
        className="size-12 rounded-lg object-cover dark:brightness-90"
      />
      <div className="flex w-full items-center justify-between space-x-4 overflow-hidden">
        <div className="min-w-0">
          <div className="truncate text-xl font-bold decoration-2 group-hover:underline group-focus-visible:underline">
            {dataset.title}
          </div>
          <div className="text-muted-foreground truncate text-sm">
            {dataset.description?.slice(0, 400)}
          </div>
        </div>
        {datasetStats.some((stat) => !!stat.text) && (
          <div
            className={cn(
              "text-muted-foreground grid w-36 shrink-0 grid-cols-1 grid-rows-2 gap-x-4 gap-y-1",
              "[&_svg]:size-4 [&_svg]:shrink-0",
              "hidden @xl:block",
            )}
          >
            {datasetStats.map(
              (stat, i) =>
                stat.text && (
                  <div key={i} className="flex items-center space-x-1">
                    {stat.icon}
                    <span className="text-nowrap">{stat.text}</span>
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </Link>
  );

  return hoverCard ? (
    <HoverCard openDelay={800} closeDelay={100}>
      <HoverCardTrigger asChild>{row}</HoverCardTrigger>
      <HoverCardContent align="end" side="top" asChild>
        <DatasetHoverCard dataset={dataset} className="w-[50dvw] max-w-xl min-w-64" />
      </HoverCardContent>
    </HoverCard>
  ) : (
    row
  );
}
