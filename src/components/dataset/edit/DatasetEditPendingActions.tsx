"use client";

import * as React from "react";
import { useState } from "react";

import { DatasetEditPendingActionItems } from "@/components/dataset/edit/DatasetEditPendingActionItems";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
} from "@/components/ui/carousel";

export function DatasetEditPendingActions() {
  // const { dataset } = useDataset();
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div>
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
          <h2 className="text-2xl font-bold">Pending Actions</h2>
          <div className="flex items-center space-x-2">
            <CarouselPrevious staticPositioning />
            <CarouselNext staticPositioning />
          </div>
        </div>
        <div>
          <CarouselContent gutter>
            <DatasetEditPendingActionItems />
          </CarouselContent>
          <CarouselScrollDots api={api} />
        </div>
      </Carousel>
    </div>
  );
}
