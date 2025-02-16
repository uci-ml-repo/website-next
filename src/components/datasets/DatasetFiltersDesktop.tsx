"use client";

import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";

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
import type { DatasetQuery } from "@/server/schema/dataset";

export function DatasetFiltersDesktop() {
  const [tooltipsOpen, setTooltipsOpen] = useState<boolean>(false);

  const { clearFilters, filterActive } = useQueryFilters<DatasetQuery>();

  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(datasetFilters.length).fill(false),
  );

  const isAnyOpen = openStates.some((state) => state);

  return (
    <div className="mt-6 space-y-2">
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
        {filterActive({ except: ["order", "limit", "cursor"] }) && (
          <Button
            variant="secondary"
            size="xs"
            className="animate-in fade-in-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => clearFilters({ except: ["order"] })}
          >
            <XIcon />
            Clear
          </Button>
        )}
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
