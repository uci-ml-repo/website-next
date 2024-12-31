import { DownloadIcon, EyeIcon } from "lucide-react";

import { auth } from "@/auth";
import DatasetBookmarkButton from "@/components/dataset/page/interactions/bookmark/DatasetBookmarkButton";
import DatasetExtendedOptions from "@/components/dataset/page/interactions/extended/DatasetExtendedOptions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateDecimal, cn } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export interface DatasetActivityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dataset: DatasetResponse;
}

export default async function DatasetInteractions({
  dataset,
  className,
  ...props
}: DatasetActivityProps) {
  const activity = [
    {
      icon: EyeIcon,
      value: abbreviateDecimal(dataset.viewCount),
      tooltip: `${dataset.viewCount.toLocaleString("en")} Views`,
    },
    {
      icon: DownloadIcon,
      value: abbreviateDecimal(dataset.downloadCount),
      tooltip: `${dataset.downloadCount.toLocaleString("en")} Downloads`,
    },
  ];

  const session = await auth();

  const isBookmarked = session?.user.id
    ? await caller.datasets.bookmarks.isBookmarked({
        datasetId: dataset.id,
        userId: session?.user.id,
      })
    : false;

  return (
    <div
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <TooltipProvider delayDuration={300} disableHoverableContent>
        {activity.map((activityItem, index) => (
          <Tooltip key={index}>
            <TooltipTrigger className="flex items-center space-x-1 text-sm">
              <activityItem.icon className="size-4" />
              <span>{activityItem.value}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {activityItem.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
        <DatasetBookmarkButton
          dataset={dataset}
          initialBookmarked={isBookmarked}
        />
      </TooltipProvider>

      <DatasetExtendedOptions dataset={dataset} />
    </div>
  );
}
