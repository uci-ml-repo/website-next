import { ArrowRightIcon } from "lucide-react";
import * as React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActionPriority = "required" | "recommended" | null;

type ActionItem = {
  title: string;
  description: string;
  children?: React.ReactNode;
  priority: ActionPriority;
};

function actionItems({
  dataset,
  hasFiles,
}: {
  dataset: DatasetResponse;
  hasFiles: boolean;
}) {
  const actions: ActionItem[] = [];

  if (!dataset.externalLink && !hasFiles) {
    actions.push({
      title: "Upload Files",
      description: "Upload dataset files to share with the community.",
      priority: "required",
    });
  }

  if (!dataset.description) {
    actions.push({
      title: "Add description",
      description:
        "Add details about your dataset to help others understand its contents.",
      priority: "required",
    });
  }

  if (!dataset.hasGraphics) {
    actions.push({
      title: "Upload thumbnail",
      description: "Upload a thumbnail image to represent your dataset.",
      priority: "recommended",
    });
  }

  return actions;
}

export function DatasetEditPendingActionItems() {
  const { dataset } = useDataset();
  const { fileStatus } = useDatasetFileStatus();

  const items = actionItems({
    dataset,
    hasFiles: !!fileStatus && fileStatus !== "awaiting-upload",
  });

  return (
    <>
      {items.map(({ title, description, priority, children }, index) => (
        <CarouselItem
          key={index}
          className="flex basis-full @md:basis-1/2 @3xl:basis-1/3 @4xl:basis-1/4"
        >
          <Card
            className={cn(
              "lift flex w-full flex-1",
              {
                "border-b-[3px] border-b-uci-gold": priority === "required",
              },
              { "border-b-[3px] border-b-uci-blue": priority == "recommended" },
            )}
            tabIndex={0}
          >
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="h-full space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold">{title}</div>
                  <ArrowRightIcon className="size-5" />
                </div>
                <CardDescription>
                  <div>{description}</div>
                  {children && <div>{children}</div>}
                </CardDescription>
              </div>
              <div className="flex justify-end">
                {priority === "required" ? (
                  <Badge variant="gold-strong">REQUIRED</Badge>
                ) : (
                  priority === "recommended" && (
                    <Badge variant="blue">RECOMMENDED</Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </>
  );
}
