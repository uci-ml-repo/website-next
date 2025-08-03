import { CalendarDaysIcon, Columns3Icon, EyeIcon, MicroscopeIcon, Rows3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { abbreviateDecimal, abbreviateFileSize } from "@/lib/util/abbreviate";
import { cn } from "@/lib/util/cn";
import type { DatasetSelect } from "@/server/types/dataset/response";
import { formatEnum } from "@/server/types/util/enum";

interface Props extends ComponentProps<typeof Card> {
  dataset: DatasetSelect;
}

type DatasetStat = {
  icon: ReactNode;
  text: string | null;
  tooltip: string;
};

export function DatasetCard({ dataset, className, ...props }: Props) {
  const datasetStats: DatasetStat[] = [
    {
      icon: <MicroscopeIcon />,
      text: dataset.tasks ? formatEnum(dataset.tasks) : null,
      tooltip: "Dataset Tasks",
    },
    {
      icon: <Columns3Icon />,
      text: dataset.featureCount ? `${abbreviateDecimal(dataset.featureCount)} Features` : null,
      tooltip: "Number of Features",
    },
    {
      icon: <Rows3Icon />,
      text: dataset.instanceCount ? `${abbreviateDecimal(dataset.instanceCount)} Instances` : null,
      tooltip: "Number of Instances",
    },
    {
      icon: <CalendarDaysIcon />,
      text: dataset.yearCreated ? dataset.yearCreated.toString() : null,
      tooltip: "Year Created",
    },
  ];

  return (
    <Link href={ROUTES.DATASET.DATASET(dataset)} className="lift block rounded-2xl">
      <Card
        className={cn("group flex h-(--dataset-card-height) flex-col overflow-hidden", className)}
        {...props}
      >
        <Image
          width={300}
          height={100}
          className="h-24 w-full shrink-0 object-cover object-center"
          src={ROUTES.DATASET.THUMBNAIL(dataset)}
          alt="Thumbnail"
        />
        <CardContent className="flex grow flex-col space-y-2 p-3">
          <div className="flex grow flex-col space-y-2">
            <CardTitle className="line-clamp-2 group-hover:underline">{dataset.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {dataset.description?.slice(0, 300)}
            </CardDescription>
          </div>
          <CardDescription className="space-y-1">
            <TooltipProvider>
              {datasetStats.map(
                (stat, i) =>
                  stat.text && (
                    <Tooltip key={i}>
                      <TooltipTrigger
                        className="flex cursor-pointer items-center space-x-2 [&_svg]:size-4"
                        tabIndex={-1}
                      >
                        {stat.icon}
                        <span className="truncate text-sm">{stat.text}</span>
                      </TooltipTrigger>
                      <TooltipContent side="left">{stat.tooltip}</TooltipContent>
                    </Tooltip>
                  ),
              )}
            </TooltipProvider>
          </CardDescription>
        </CardContent>
        <CardFooter className="@container h-9 justify-between border-t py-2.5">
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
                  <span className="@4xs:block hidden">
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
    </Link>
  );
}
