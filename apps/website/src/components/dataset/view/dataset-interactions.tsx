import type { DatasetSelect } from "@packages/db/types";
import { DownloadIcon, EyeIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { abbreviateDecimal } from "@/lib/util/abbreviate";

export function DatasetInteractions({ dataset }: { dataset: DatasetSelect }) {
  const datasetStats = [
    {
      icon: <EyeIcon />,
      value: dataset.viewCount,
      tooltip: `${dataset.viewCount.toLocaleString()} Views`,
    },
    {
      icon: <DownloadIcon />,
      value: dataset.downloadCount,
      tooltip: `${dataset.downloadCount?.toLocaleString()} Downloads`,
    },
  ];

  return (
    <div className="flex items-center gap-x-6 py-2">
      <TooltipProvider>
        {datasetStats.map(
          ({ icon, value, tooltip }) =>
            value !== null && (
              <Tooltip key={tooltip}>
                <TooltipTrigger className="flex items-center gap-x-1 [&_svg]:size-5">
                  {icon}
                  {abbreviateDecimal(value)}
                </TooltipTrigger>
                <TooltipContent side="bottom">{tooltip}</TooltipContent>
              </Tooltip>
            ),
        )}
      </TooltipProvider>
    </div>
  );
}
