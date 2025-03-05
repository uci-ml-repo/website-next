"use client";

import * as React from "react";
import { useState } from "react";

import { DatasetEditPendingActionCard } from "@/components/dataset/edit/DatasetEditPendingActionCard";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
} from "@/components/ui/carousel";

export function DatasetEditPendingActions() {
  // const { dataset } = useDataset();
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="space-y-2">
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
        <CarouselContent gutter>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full @xs:basis-1/2 @2xl:basis-1/3 @3xl:basis-1/4"
            >
              <DatasetEditPendingActionCard />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <CarouselScrollDots api={api} />
    </div>
  );
}
