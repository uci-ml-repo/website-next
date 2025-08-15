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
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { abbreviateDecimal, abbreviateFileSize } from "@/lib/util/abbreviate";
import { cn } from "@/lib/util/cn";
import type { DatasetSelect } from "@/server/types/dataset/response";
import { formatEnum } from "@/server/types/util/enum";

type Props = ComponentProps<typeof Card> & {
  dataset: DatasetSelect;
};

const datasetStats = (dataset: DatasetSelect) => [
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

export function DatasetHoverCard({ dataset, className, ...props }: Props) {
  return (
    <Card className={cn("border-b-gold !border-b-2 !p-0", className)} {...props}>
      <CardContent className="space-y-3 p-4 pb-2">
        <div className="space-y-2">
          <CardTitle>
            <Link
              href={ROUTES.DATASET(dataset)}
              className="line-clamp-2 w-fit decoration-2 hover:underline"
            >
              {dataset.title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-4 text-base">
            {dataset.description?.slice(0, 1000)}
          </CardDescription>
        </div>
        <CardDescription className="flex items-end">
          <TooltipProvider delayDuration={150}>
            <div className="grid w-full grid-flow-row grid-cols-1 md:grid-cols-2">
              {datasetStats(dataset).map((stat, i) => {
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
                      <TooltipContent side="left">{stat.tooltip}</TooltipContent>
                    </Tooltip>
                  );
              })}
            </div>
          </TooltipProvider>
        </CardDescription>
      </CardContent>
      <CardFooter className="@container flex h-10 items-center justify-between border-t py-2.5">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-1">
            <EyeIcon className="size-5" />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          {dataset.downloadCount && (
            <div className="flex items-center space-x-1 @max-2xs:hidden">
              <DownloadIcon className="size-5" />
              <div>{abbreviateDecimal(dataset.downloadCount)}</div>
            </div>
          )}
        </div>
        {dataset.externalLink ? (
          <Badge variant="secondary">External</Badge>
        ) : (
          <>
            {dataset.fileCount !== null && dataset.size !== null ? (
              <div className="flex items-center space-x-1">
                <span className="@max-3xs:hidden">
                  {dataset.fileCount === 1 ? "1 File" : `${dataset.fileCount} Files`} &middot;
                </span>
                <span>{abbreviateFileSize(dataset.size)}</span>
              </div>
            ) : (
              <Badge variant="secondary">Missing Files</Badge>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
