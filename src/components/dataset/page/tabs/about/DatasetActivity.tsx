import {
  BookmarkIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  EyeIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
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
  const { data: session } = useSession();

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
      <div className={"flex items-center space-x-6"}>
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

        {session?.user && <BookmarkIcon className={"size-5"} />}
      </div>

      <Button pill variant={"ghost"} size={"icon"}>
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
}
