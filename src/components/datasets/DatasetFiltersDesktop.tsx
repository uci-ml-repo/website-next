"use client";

import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
} from "lucide-react";
import React, { useState } from "react";

import { DatasetFiltersClear } from "@/components/datasets/DatasetFiltersClear";
import {
  DatasetFilterContent,
  datasetFilters,
} from "@/components/datasets/DatasetFiltersContent";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

export function DatasetFiltersDesktop({ className }: { className: string }) {
  const [tooltipsOpen, setTooltipsOpen] = useState<boolean>(false);
  const { filters } = useQueryFilters<DatasetQuery>();
  const [openStates, setOpenStates] = useState<boolean[]>([
    !!filters.attributes?.length,
    !!filters.keywords?.length,
    !!filters.dataTypes?.length,
    !!filters.subjectAreas?.length,
    !!filters.tasks?.length,
    !!filters.featureTypes?.length,
    !!filters.featureCountMax || !!filters.featureCountMin,
    !!filters.instanceCountMax || !!filters.instanceCountMin,
    !!filters.python,
  ]);

  const isAnyOpen = openStates.some((state) => state);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mr-3 flex items-center justify-between space-x-2 text-lg text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Filters</span>
          <Tooltip
            open={tooltipsOpen}
            onOpenChange={setTooltipsOpen}
            delayDuration={150}
            disableHoverableContent
          >
            <TooltipTrigger
              onClick={(event) => {
                event.preventDefault();
              }}
              aria-label="Filters Help"
            >
              <CircleHelpIcon className="size-[18px] cursor-help" />
            </TooltipTrigger>
            <TooltipContent
              className="hidden"
              onPointerDownOutside={(event) => {
                event.preventDefault();
              }}
            />
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (isAnyOpen) {
                    setOpenStates(Array(datasetFilters.length).fill(false));
                  } else {
                    setOpenStates(Array(datasetFilters.length).fill(true));
                  }
                }}
                className="text-muted-foreground"
                aria-label={isAnyOpen ? "Collapse All" : "Expand All"}
              >
                {isAnyOpen ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isAnyOpen ? "Collapse" : "Expand"} All
            </TooltipContent>
          </Tooltip>
        </div>
        <DatasetFiltersClear />
      </div>
      <Card className="overflow-hidden shadow-none">
        <DatasetFilterContent
          tooltipsOpen={tooltipsOpen}
          openStates={openStates}
          setOpenStates={setOpenStates}
        />
      </Card>
    </div>
  );
}
