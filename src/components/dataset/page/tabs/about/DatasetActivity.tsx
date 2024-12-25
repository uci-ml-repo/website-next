import { DownloadIcon, EyeIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { abbreviateDecimal } from "@/lib/utils/format";

export interface DatasetActivityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dataset: DatasetResponse;
}

export default function DatasetActivity({
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
    <div className={cn("flex items-center space-x-6", className)} {...props}>
      {activity.map((activityItem, index) => (
        <TooltipProvider
          key={index}
          delayDuration={100}
          disableHoverableContent
        >
          <Tooltip>
            <TooltipTrigger className={"flex items-center space-x-1 text-sm"}>
              <activityItem.icon className={"size-4"} />
              <span>{activityItem.value}</span>
            </TooltipTrigger>
            <TooltipContent side={"bottom"} forceMount>
              {activityItem.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
