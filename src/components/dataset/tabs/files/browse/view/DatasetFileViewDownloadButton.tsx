import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DatasetFileViewDownloadButton({ path }: { path: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="size-8 shrink-0 rounded-md" asChild>
            <a href={path} download>
              <DownloadIcon />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
