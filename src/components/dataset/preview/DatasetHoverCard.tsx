import {
  CalendarDaysIcon,
  Columns3Icon,
  DownloadIcon,
  EyeIcon,
  LibraryBigIcon,
  MicroscopeIcon,
  Rows3Icon,
  VariableIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DatasetPreviewResponse } from "@/lib/types";
import {
  abbreviateDecimal,
  abbreviateFileSize,
  cn,
  formatEnum,
} from "@/lib/utils";

type DatasetStat = {
  icon: React.ReactNode;
  text: string | null;
  tooltip: string;
  mobileExclude?: boolean;
};

export function DatasetHoverCard({
  dataset,
}: {
  dataset: DatasetPreviewResponse;
}) {
  const datasetStats: DatasetStat[] = [
    {
      icon: <Columns3Icon />,
      text: dataset.featureCount
        ? `${abbreviateDecimal(dataset.featureCount)} ${dataset.featureCount === 1 ? "Feature" : "Features"}`
        : null,
      tooltip: "Feature Count",
    },
    {
      icon: <MicroscopeIcon />,
      text: dataset.tasks ? formatEnum(dataset.tasks) : null,
      tooltip: "Dataset Tasks",
      mobileExclude: true,
    },
    {
      icon: <Rows3Icon />,
      text: dataset.instanceCount
        ? `${abbreviateDecimal(dataset.instanceCount)} ${dataset.instanceCount === 1 ? "Instance" : "Instances"}`
        : null,
      tooltip: "Instance Count",
    },

    {
      icon: <LibraryBigIcon />,
      text: dataset.subjectArea ? formatEnum(dataset.subjectArea) : null,
      tooltip: "Subject Area",
    },
    {
      icon: <VariableIcon />,
      text: dataset.featureTypes ? formatEnum(dataset.featureTypes) : null,
      tooltip: "Feature Types",
      mobileExclude: true,
    },
    {
      icon: <CalendarDaysIcon />,
      text: dataset.yearCreated ? dataset.yearCreated.toString() : null,
      tooltip: "Year Created",
    },
  ];

  return (
    <div className="rounded-xl border-b-2 border-uci-gold p-1">
      <CardContent className="flex flex-1 flex-col space-y-3">
        <div className="flex flex-1 flex-col space-y-2">
          <CardTitle>
            <Link
              href={DATASET_ROUTE(dataset)}
              className="line-clamp-2 w-fit decoration-2 hover:underline"
            >
              {dataset.title}
            </Link>
          </CardTitle>
          <CardDescription>
            <p className="line-clamp-4 text-base">
              {dataset.subtitle ?? dataset.description}
            </p>
          </CardDescription>
        </div>
        <CardDescription className="flex items-end">
          <TooltipProvider delayDuration={150}>
            <div className="grid w-full grid-flow-row grid-cols-1 md:grid-cols-2">
              {datasetStats.map((stat, i) => {
                if (stat.text)
                  return (
                    <Tooltip key={i} disableHoverableContent>
                      <TooltipTrigger
                        className={cn(
                          "flex items-center space-x-2 p-1 [&_svg]:size-4 [&_svg]:shrink-0",
                          { "max-md:hidden": stat.mobileExclude },
                        )}
                      >
                        {stat.icon}
                        <span className="truncate">{stat.text}</span>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {stat.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  );
              })}
            </div>
          </TooltipProvider>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex h-10 items-center justify-between border-t py-2.5 @container">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <EyeIcon />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          <div className="hidden items-center space-x-1 @2xs:flex">
            <DownloadIcon />
            <div>{abbreviateDecimal(dataset.downloadCount)}</div>
          </div>
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
                <span className="hidden @2xs:block">&middot;</span>
                <span>{abbreviateFileSize(dataset.size)}</span>
              </div>
            ) : (
              <Badge variant="secondary">Missing Files</Badge>
            )}
          </>
        )}
      </CardFooter>
    </div>
  );
}
