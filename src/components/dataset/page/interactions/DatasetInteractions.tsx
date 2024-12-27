import { DownloadIcon, EyeIcon } from "lucide-react";

import DatasetBookmarkButton from "@/components/dataset/page/interactions/bookmark/DatasetBookmarkButton";
import DatasetExtendedOptionsDropdown from "@/components/dataset/page/interactions/extended/DatasetExtendedOptionsDropdown";
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

export default function DatasetInteractions({
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
    <div className={cn("flex items-center space-x-4", className)} {...props}>
      <div className="flex items-center space-x-6">
        {activity.map((activityItem, index) => (
          <TooltipProvider
            key={index}
            delayDuration={100}
            disableHoverableContent
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center space-x-1 text-sm">
                <activityItem.icon className="size-4" />
                <span>{activityItem.value}</span>
              </TooltipTrigger>
              <TooltipContent side="bottom" forceMount>
                {activityItem.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <DatasetBookmarkButton dataset={dataset} />
      </div>
      <DatasetExtendedOptionsDropdown dataset={dataset} />
    </div>
  );
}
