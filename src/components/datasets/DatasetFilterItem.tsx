import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function DatasetFilterItem({
  label,
  children,
  active,
  activeCount,
  clearFilter,
  tooltipOpen,
  tooltipContent,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  activeCount?: number;
  clearFilter: () => void;
  tooltipOpen: boolean;
  tooltipContent: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Tooltip open={tooltipOpen}>
      <Collapsible open={open} onOpenChange={setOpen} className="w-full">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center hover:bg-accent">
          <div className="flex w-full items-center justify-between p-4">
            <div className="select-none font-medium">{label}</div>
            <div className="flex items-center space-x-2">
              {active && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full bg-uci-blue",
                        "group transition-colors hover:bg-destructive-muted focus:bg-destructive-muted",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearFilter();
                      }}
                      asChild
                    >
                      <div className="text-sm text-uci-blue-foreground">
                        {activeCount ?? (
                          <>
                            <XIcon className="hidden group-hover:block group-focus:block" />
                            <CheckIcon className="group-hover:hidden group-focus:hidden" />
                          </>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              )}
              <ChevronDownIcon
                className={cn("size-5 opacity-50 transition-all duration-100", {
                  "-rotate-180": open,
                })}
              />
            </div>
          </div>
          <TooltipTrigger className="size-0" asChild>
            <div />
          </TooltipTrigger>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ height: 0 }}
            animate={open ? { height: "auto" } : {}}
            transition={{ duration: 0.1 }}
            className="overflow-y-hidden bg-background"
          >
            <div className="w-full select-none px-4 py-2 text-sm">
              {children}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
      <TooltipContent
        side="right"
        className="bg-uci-gold text-base text-uci-gold-foreground shadow-md"
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
