"use client";

import { ChevronsDownUpIcon, ChevronsUpDownIcon, CircleHelpIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DatasetSearchFiltersAccordion, searchFilters } from "./dataset-search-filters-accordion";

export function DatasetSearchFiltersDesktop() {
  const [tooltipsOpen, setTooltipsOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  const anyExpanded = expandedFilters.length > 0;

  return (
    <div className="group space-y-1">
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
                anyExpanded
                  ? setExpandedFilters([])
                  : setExpandedFilters(searchFilters.map(({ name }) => name))
              }
            >
              {anyExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{anyExpanded ? "Collapse" : "Expand"} All</TooltipContent>
        </Tooltip>
      </div>

      <Card className="w-72 overflow-hidden">
        <DatasetSearchFiltersAccordion
          type="multiple"
          value={expandedFilters}
          onValueChange={setExpandedFilters}
          tooltipsOpen={tooltipsOpen}
        />
      </Card>
    </div>
  );
}
