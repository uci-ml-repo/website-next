import { ArrowRightIcon } from "lucide-react";
import * as React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActionItem = {
  title: string;
  description: string;
  children: React.ReactNode;
  required?: boolean;
};

function actionItems(dataset: DatasetResponse) {
  const actions: ActionItem[] = [];

  actions.push({ required: true });
  actions.push({ required: false });

  return actions;
}

export function DatasetEditPendingActionItems() {
  const { dataset } = useDataset();

  return (
    <>
      {actionItems(dataset).map((actionItem, index) => (
        <CarouselItem
          key={index}
          className="basis-full @xs:basis-1/2 @2xl:basis-1/3 @3xl:basis-1/4"
        >
          <button className="w-full">
            <Card
              className={cn("lift h-28", {
                "border-b-[3px] border-b-uci-gold": actionItem.required,
              })}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="font-bold">Title</div>
                  <ArrowRightIcon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </button>
        </CarouselItem>
      ))}
    </>
  );
}
