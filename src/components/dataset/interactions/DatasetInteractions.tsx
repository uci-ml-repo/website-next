import { DownloadIcon, EyeIcon } from "lucide-react";

import { DatasetBookmarkButton } from "@/components/dataset/interactions/bookmark/DatasetBookmarkButton";
import { DatasetExtendedOptions } from "@/components/dataset/interactions/extended/DatasetExtendedOptions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateDecimal, cn } from "@/lib/utils";

export interface DatasetActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  dataset: DatasetResponse;
}

export function DatasetInteractions({ dataset, className, ...props }: DatasetActivityProps) {
  return (
    <div className={cn("flex items-center space-x-4 p-0.5", className)} {...props}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex items-center space-x-1">
            <EyeIcon className="size-4 lg:size-5" />
            <span className="text-sm">{abbreviateDecimal(dataset.viewCount)}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">{dataset.viewCount.toLocaleString()} Views</TooltipContent>
        </Tooltip>
        {dataset.downloadCount !== null && (
          <Tooltip>
            <TooltipTrigger className="flex items-center space-x-1">
              <DownloadIcon className="size-4 lg:size-5" />
              <span className="text-sm">{abbreviateDecimal(dataset.downloadCount)}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {dataset.downloadCount.toLocaleString()} Downloads
            </TooltipContent>
          </Tooltip>
        )}
        <DatasetBookmarkButton dataset={dataset} />
      </TooltipProvider>
      <DatasetExtendedOptions dataset={dataset} />
    </div>
  );
}
