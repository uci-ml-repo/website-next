"use client";

import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { DATASET_FILES_ROUTE, DATASET_SETTINGS_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActionPriority = "required" | "recommended" | null;

type ActionItem = {
  title: string;
  description: string;
  priority: ActionPriority;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function DatasetEditPendingActions() {
  const router = useRouter();

  const [api, setApi] = useState<CarouselApi>();
  const { dataset, startEditingField } = useDataset();
  const { fileStatus } = useDatasetFileStatus();

  function actionItems({
    dataset,
    hasFiles,
    canSubmit,
  }: {
    dataset: DatasetResponse;
    hasFiles: boolean;
    canSubmit: boolean;
  }) {
    const actions: ActionItem[] = [];

    if (!dataset.externalLink && !hasFiles) {
      actions.push({
        title: "Upload Files",
        description: "Upload files for your dataset.",
        priority: "required",
        onClick: () => router.push(DATASET_FILES_ROUTE(dataset)),
      });
    }

    if (!dataset.description) {
      actions.push({
        title: "Add description",
        description: "Add details about your dataset to help others understand its contents.",
        priority: "required",
        onClick: () => startEditingField("description"),
      });
    }

    if (!dataset.subjectArea) {
      actions.push({
        title: "Add a subject area",
        description: "Add a subject area to help others find your dataset.",
        priority: "required",
        onClick: () => startEditingField("subjectArea"),
      });
    }

    if (!dataset.introductoryPaper) {
      actions.push({
        title: "Add an introductory paper",
        description: "Datasets must be published in a peer-reviewed venue.",
        priority: "required",
      });
    }

    if (!dataset.yearCreated) {
      actions.push({
        title: "Add year created",
        description: "Add what year the dataset was originally created.",
        priority: "required",
      });
    }

    if (!dataset.variables.length) {
      actions.push({
        title: "Add variable information",
        description: "Add information about the variables in the dataset.",
        priority: "recommended",
      });
    }

    if (!dataset.authors.length) {
      actions.push({
        title: "Add authors",
        description: "Add information about the authors of the dataset.",
        priority: "recommended",
      });
    }

    if (!dataset.keywords.length) {
      actions.push({
        title: "Add keywords",
        description: "Add keywords to help others find your dataset.",
        priority: "recommended",
      });
    }

    if (!dataset.hasGraphics) {
      actions.push({
        title: "Upload thumbnail",
        description: "Upload a thumbnail image to represent your dataset.",
        priority: "recommended",
        onClick: () => router.push(DATASET_SETTINGS_ROUTE(dataset)),
      });
    }

    actions.push({
      title: "Submit for review",
      description: "Submit your dataset for review.",
      priority: null,
      children: (
        <div className="flex h-full items-center justify-between">
          <Button
            asChild
            disabled={!canSubmit}
            className={cn("mx-auto", {
              "bg-secondary-foreground opacity-50": !canSubmit,
            })}
            variant="positive"
            tabIndex={-1}
          >
            <div>Submit</div>
          </Button>
        </div>
      ),
      disabled: !canSubmit,
    });

    return actions;
  }

  const items = actionItems({
    dataset,
    hasFiles: !!fileStatus && fileStatus !== "awaiting-upload",
    canSubmit: datasetPreApprovalSelect.safeParse(dataset).success,
  });

  const requiredCount = items.filter((item) => item.priority === "required").length;

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
          {items.map(({ title, description, priority, children, disabled, onClick }, index) => (
            <CarouselItem
              key={index}
              className="flex basis-full select-none @md:basis-1/2 @3xl:basis-1/3 @4xl:basis-1/4"
            >
              <button
                onClick={disabled ? undefined : onClick}
                className={cn("h-full w-full rounded-2xl text-left", {
                  "cursor-default": disabled,
                })}
              >
                <Card
                  className={cn(
                    "flex h-full w-full flex-1",
                    { lift: !disabled },
                    { "bg-muted": disabled },
                    {
                      "border-b-[3px] border-b-uci-gold": priority === "required",
                    },
                    {
                      "border-b-[3px] border-b-uci-blue": priority == "recommended",
                    },
                  )}
                >
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <div className="flex h-full flex-col space-y-0.5">
                      <div className="flex items-center justify-between space-x-1">
                        <div className="font-bold">{title}</div>
                        {!disabled && <ArrowRightIcon className="size-5" />}
                      </div>
                      <CardDescription>{description}</CardDescription>
                      {children}
                    </div>
                    {priority && (
                      <div className="flex justify-end">
                        {priority === "required" && <Badge variant="gold-strong">REQUIRED</Badge>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselScrollDots api={api} className="mt-1" />
      </div>
    </Carousel>
  );
}
