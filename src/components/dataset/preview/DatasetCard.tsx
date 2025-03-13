import {
  CalendarDaysIcon,
  Columns3Icon,
  EyeIcon,
  MicroscopeIcon,
  Rows3Icon,
} from "lucide-react";
import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATASET_API_THUMBNAIL_ROUTE, DATASET_ROUTE } from "@/lib/routes";
import type { DatasetPreviewResponse } from "@/lib/types";
import {
  abbreviateDecimal,
  abbreviateFileSize,
  cn,
  formatEnum,
} from "@/lib/utils";

interface DatasetCardProps {
  dataset: DatasetPreviewResponse;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
}

type DatasetStat = {
  icon: React.ReactNode;
  text: string | null;
  tooltip?: string;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#DDD" offset="20%" />
      <stop stop-color="#CCC" offset="50%" />
      <stop stop-color="#DDD" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#DDD" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const placeholder = `data:image/svg+xml;base64,${toBase64(shimmer(350, 100))}`;

export function DatasetCard({ dataset, ref, className }: DatasetCardProps) {
  const thumbnail = DATASET_API_THUMBNAIL_ROUTE(dataset);
  const href = DATASET_ROUTE(dataset);

  const datasetStats: DatasetStat[] = [
    {
      icon: <MicroscopeIcon />,
      text: dataset.tasks ? formatEnum(dataset.tasks) : null,
      tooltip: "Dataset Tasks",
    },
    {
      icon: <Columns3Icon />,
      text: dataset.featureCount
        ? `${abbreviateDecimal(dataset.featureCount)} Features`
        : null,
      tooltip: "Number of Features",
    },
    {
      icon: <Rows3Icon />,
      text: dataset.instanceCount
        ? `${abbreviateDecimal(dataset.instanceCount)} Instances`
        : null,
      tooltip: "Number of Instances",
    },
    {
      icon: <CalendarDaysIcon />,
      text: dataset.yearCreated ? dataset.yearCreated.toString() : null,
      tooltip: "Year Created",
    },
  ];

  return (
    <Link href={href} className="lift-lg flex flex-1 flex-col rounded-2xl">
      <Card
        className={cn("group flex h-[355px] flex-col", className)}
        ref={ref}
      >
        <CardHeader className="relative p-0">
          <Image
            src={thumbnail}
            alt={`${dataset.title} thumbnail`}
            width={350}
            height={100}
            loading="eager"
            placeholder={placeholder as PlaceholderValue}
            className={cn(
              "h-24 w-full rounded-t-2xl object-cover object-center",
              "transition-opacity duration-500 dark:brightness-90",
            )}
          />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-2">
          <div className="flex flex-1 flex-col space-y-2">
            <CardTitle>
              <div className="line-clamp-2 group-hover:underline">
                {dataset.title}
              </div>
            </CardTitle>
            <CardDescription>
              <p className="line-clamp-2 text-sm">
                {dataset.description?.slice(0, 200)}
              </p>
            </CardDescription>
          </div>
          <CardDescription className="space-y-1">
            <TooltipProvider>
              {datasetStats.map(
                (stat, i) =>
                  stat.text && (
                    <Tooltip key={i} delayDuration={200}>
                      <TooltipTrigger
                        className="flex items-center space-x-2 [&_svg]:size-4"
                        tabIndex={-1}
                      >
                        {stat.icon}
                        <span className="truncate text-sm">{stat.text}</span>
                      </TooltipTrigger>
                      {stat.tooltip && (
                        <TooltipContent side="left">
                          {stat.tooltip}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ),
              )}
            </TooltipProvider>
          </CardDescription>
        </CardContent>
        <CardFooter className="h-9 justify-between border-t py-2.5 @container">
          <div className="flex items-center space-x-1">
            <EyeIcon />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          {dataset.externalLink ? (
            <Badge variant="secondary">External</Badge>
          ) : (
            <>
              {dataset.fileCount !== null && dataset.size !== null ? (
                <div className="flex items-center space-x-1">
                  <span className="hidden @3xs:block">
                    {dataset.fileCount === 1
                      ? "1 File"
                      : `${dataset.fileCount} Files`}
                  </span>
                  <span className="hidden @3xs:block">&middot;</span>
                  <span>{abbreviateFileSize(dataset.size)}</span>
                </div>
              ) : (
                <Badge variant="secondary">Missing Files</Badge>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
