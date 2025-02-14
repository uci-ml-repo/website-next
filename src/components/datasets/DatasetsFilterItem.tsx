import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";

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

export function DatasetsFilterItem({
  label,
  children,
  active,
  activeCount,
  clearFilter,
  dropdownOpen,
  onDropdownOpenChange,
  tooltipOpen,
  tooltipContent,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  activeCount?: number;
  clearFilter: () => void;
  dropdownOpen: boolean;
  onDropdownOpenChange: () => void;
  tooltipOpen: boolean;
  tooltipContent: string;
}) {
  return (
    <Tooltip open={tooltipOpen}>
      <Collapsible
        open={dropdownOpen}
        onOpenChange={onDropdownOpenChange}
        className="w-full"
      >
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
                        "group hover:bg-destructive focus:bg-destructive",
                        "transition-opacity animate-in fade-in-0",
                      )}
                      asChild
                    >
                      <div
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearFilter();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            clearFilter();
                          }
                        }}
                      >
                        <div className="text-xs text-uci-blue-foreground group-hover:hidden group-focus:hidden">
                          {activeCount ?? <CheckIcon />}
                        </div>
                        <div className="hidden group-hover:block group-focus:block">
                          <XIcon />
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              )}
              <ChevronDownIcon
                className={cn("size-5 opacity-50 transition-all duration-100", {
                  "-rotate-180": dropdownOpen,
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
            animate={dropdownOpen ? { height: "auto" } : {}}
            transition={{ duration: 0.1 }}
            className="overflow-y-hidden bg-background dark:bg-input-background"
          >
            <div className="w-full select-none px-3 py-2 text-sm">
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
