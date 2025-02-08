"use client";

import { CircleHelpIcon, XIcon } from "lucide-react";
import { useState } from "react";

import DatasetAttributesFilter from "@/components/datasets/filters/DatasetAttributesFilter";
import DatasetDataTypesFilter from "@/components/datasets/filters/DatasetDataTypesFilter";
import DatasetFeatureCountFilter from "@/components/datasets/filters/DatasetFeatureCountFilter";
import DatasetFeatureTypesFilter from "@/components/datasets/filters/DatasetFeatureTypesFilter";
import DatasetInstanceCountFilter from "@/components/datasets/filters/DatasetInstanceCountFilter";
import DatasetKeywordsFilter from "@/components/datasets/filters/DatasetKeywordsFilter";
import DatasetPythonFilter from "@/components/datasets/filters/DatasetPythonFilter";
import DatasetSubjectAreasFilter from "@/components/datasets/filters/DatasetSubjectAreasFilter";
import DatasetTasksFilter from "@/components/datasets/filters/DatasetTasksFilter";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DatasetQuery } from "@/server/schema/dataset";

export default function DatasetsFilters() {
  const [tooltipsOpen, setTooltipsOpen] = useState<boolean>(false);
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const filterActive = Object.entries(filters).some(
    ([key, value]) => !["search", "order"].includes(key) && value !== undefined,
  );

  const clearFilters = () => {
    const clearedFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) =>
        ["search", "order"].includes(key) ? [key, value] : [key, undefined],
      ),
    );

    setFilters(clearedFilters);
  };

  return (
    <div className="mt-6 space-y-2">
      <div className="mr-3 flex items-center justify-between space-x-2 text-lg text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Filters</span>
          <Tooltip
            open={tooltipsOpen}
            onOpenChange={setTooltipsOpen}
            delayDuration={150}
          >
            <TooltipTrigger>
              <CircleHelpIcon className="size-[18px] cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="hidden" />
          </Tooltip>
        </div>
        {filterActive && (
          <Button
            variant="secondary"
            size="xs"
            className="hover:bg-destructive hover:text-destructive-foreground"
            onClick={clearFilters}
          >
            <XIcon />
            Clear
          </Button>
        )}
      </div>
      <Card className="overflow-hidden shadow-none">
        <DatasetKeywordsFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetAttributesFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetDataTypesFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetSubjectAreasFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetTasksFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetFeatureTypesFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetFeatureCountFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetInstanceCountFilter tooltipOpen={tooltipsOpen} />
        <Separator />
        <DatasetPythonFilter tooltipOpen={tooltipsOpen} />
      </Card>
    </div>
  );
}
