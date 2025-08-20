"use client";

import { ChevronsDownUpIcon, ChevronsUpDownIcon, CircleHelpIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useState } from "react";

import { DatasetFiltersClear } from "@/components/dataset/search/filter/dataset-filters-clear";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/util/cn";

import { DatasetFiltersAccordion, filterNames } from "./dataset-filters-accordion";

export function DatasetFiltersDesktop({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [tooltipsOpen, setTooltipsOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  const anyExpanded = expandedFilters.length > 0;

  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-lg">Filters</div>

          <Tooltip disableHoverableContent onOpenChange={setTooltipsOpen}>
            <TooltipTrigger
              onClick={(event) => event.preventDefault()}
              onPointerDown={(event) => event.preventDefault()}
              aria-label="Show filter descriptions"
            >
              <CircleHelpIcon className="size-4.5 cursor-help" />
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  anyExpanded ? setExpandedFilters([]) : setExpandedFilters(filterNames)
                }
                aria-label={anyExpanded ? "Collapse all filters" : "Expand all filters"}
              >
                {anyExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{anyExpanded ? "Collapse" : "Expand"} All</TooltipContent>
          </Tooltip>
        </div>
        <DatasetFiltersClear />
      </div>

      <Card className="bg-card/50 w-72">
        <DatasetFiltersAccordion
          type="multiple"
          value={expandedFilters}
          onValueChange={setExpandedFilters}
          tooltipsOpen={tooltipsOpen}
        />
      </Card>
    </div>
  );
}
