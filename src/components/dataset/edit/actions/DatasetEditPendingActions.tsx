"use client";

import { ArrowRightIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { actionItems } from "@/components/dataset/edit/actions/dataset-edit-pending-action-items";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
} from "@/components/ui/carousel";
import { datasetPreApprovalSelect } from "@/db/lib/types";
import { cn } from "@/lib/utils";

export function DatasetEditPendingActions() {
  const [api, setApi] = useState<CarouselApi>();
  const { dataset } = useDataset();
  const { fileStatus } = useDatasetFileStatus();

  const items = actionItems({
    dataset,
    hasFiles: !!fileStatus && fileStatus !== "awaiting-upload",
    canSubmit: datasetPreApprovalSelect.safeParse(dataset).success,
  });

  const requiredCount = items.filter(
    (item) => item.priority === "required",
  ).length;

  return (
    <Carousel
      opts={{
        align: "start",
        skipSnaps: true,
        duration: 20,
        inViewThreshold: 0.45,
      }}
      className="space-y-2 @container"
      setApi={setApi}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Pending Actions</h2>
          <Badge variant="gold-strong" size="lg">
            {requiredCount}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <CarouselPrevious staticPositioning />
          <CarouselNext staticPositioning />
        </div>
      </div>
      <div>
        <CarouselContent gutter className="flex items-stretch">
          {items.map(
            (
              { title, description, priority, children, disabled, onClick },
              index,
            ) => (
              <CarouselItem
                key={index}
                className="flex basis-full @md:basis-1/2 @3xl:basis-1/3 @4xl:basis-1/4"
              >
                <Card
                  className={cn(
                    "flex w-full flex-1",
                    { lift: !disabled },
                    { "bg-muted": disabled },
                    {
                      "border-b-[3px] border-b-uci-gold":
                        priority === "required",
                    },
                    {
                      "border-b-[3px] border-b-uci-blue":
                        priority == "recommended",
                    },
                  )}
                  onClick={onClick}
                  tabIndex={disabled ? -1 : 0}
                >
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <div className="flex h-full flex-col space-y-0.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold">{title}</div>
                        <ArrowRightIcon className="size-5" />
                      </div>
                      <CardDescription>{description}</CardDescription>
                      {children}
                    </div>
                    {priority && (
                      <div className="flex justify-end">
                        {priority === "required" ? (
                          <Badge variant="gold-strong">REQUIRED</Badge>
                        ) : (
                          priority === "recommended" && (
                            <Badge variant="blue">RECOMMENDED</Badge>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ),
          )}
        </CarouselContent>
        <CarouselScrollDots api={api} className="mt-1" />
      </div>
    </Carousel>
  );
}
