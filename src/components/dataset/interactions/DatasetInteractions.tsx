import { DownloadIcon, EyeIcon } from "lucide-react";

import { DatasetBookmarkButton } from "@/components/dataset/interactions/bookmark/DatasetBookmarkButton";
import { DatasetExtendedOptions } from "@/components/dataset/interactions/extended/DatasetExtendedOptions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateDecimal, cn } from "@/lib/utils";

export interface DatasetActivityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dataset: DatasetResponse;
}

export function DatasetInteractions({
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

  return (
    <div
      className={cn("flex items-center space-x-4 p-0.5", className)}
      {...props}
    >
      <TooltipProvider delayDuration={200}>
        {activity.map((activityItem) => (
          <Tooltip key={activityItem.tooltip}>
            <TooltipTrigger className="flex items-center space-x-1">
              <activityItem.icon className="size-4 lg:size-5" />
              <span className="text-sm">{activityItem.value}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {activityItem.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
        <DatasetBookmarkButton dataset={dataset} />
      </TooltipProvider>
      <DatasetExtendedOptions dataset={dataset} />
    </div>
  );
}
