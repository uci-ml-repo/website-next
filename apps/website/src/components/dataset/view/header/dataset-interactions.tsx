"use client";

import type { Session } from "@packages/auth/auth";
import type { DatasetSelect } from "@packages/db/types";
import { DownloadIcon, EllipsisVerticalIcon, EyeIcon, Link2Icon } from "lucide-react";

import { DatasetBookmarkButton } from "@/components/dataset/view/header/dataset-bookmark-button";
import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { abbreviateDecimal } from "@/lib/util/abbreviate";

interface Props {
  dataset: DatasetSelect;
  session: Session | null;
}

export function DatasetInteractions({ dataset, session: _session }: Props) {
  const session = useSessionWithInitial(_session);

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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full">
              <DatasetBookmarkButton dataset={dataset} session={session} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bookmark Dataset</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(window.location.origin + ROUTES.DATASET(dataset))
            }
          >
            <Link2Icon /> Copy URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
