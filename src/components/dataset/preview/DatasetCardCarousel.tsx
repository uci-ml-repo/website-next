"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as React from "react";

import { DatasetCard } from "@/components/dataset/preview/DatasetCard";
import { DatasetCardSkeleton } from "@/components/dataset/preview/DatasetCardSkeleton";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
} from "@/components/ui/carousel";
import type { DatasetPreviewResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DatasetGroupProps {
  heading: string;
  icon?: React.ReactNode;
  seeAllHref?: string;
  endCard?: React.ReactNode;
  datasets: DatasetPreviewResponse[];
}

export function DatasetCardCarousel({
  icon,
  heading,
  seeAllHref,
  endCard,
  datasets,
}: DatasetGroupProps) {
  const [api, setApi] = useState<CarouselApi>();

  const cardBreakpoints = cn(
    "basis-full @md:basis-1/2 @2xl:basis-1/3 @5xl:basis-1/4 @[1500px]:basis-1/5",
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 sm:space-x-4 [&>svg]:size-6 sm:[&>svg]:size-7">
          {icon}
          <h2 className="text-xl font-bold sm:text-2xl">{heading}</h2>
        </div>
        {seeAllHref && (
          <Button variant="link" asChild>
            <Link href={seeAllHref}>See All</Link>
          </Button>
        )}
      </div>
      <div className="max-2xl:mx-10 max-md:mx-0">
        <Carousel
          opts={{
            align: "start",
            skipSnaps: true,
            duration: 20,
            inViewThreshold: 0.45,
          }}
          className="@container"
          setApi={setApi}
        >
          <CarouselContent gutter>
            {datasets.map((dataset) => (
              <CarouselItem key={dataset.id} className={cardBreakpoints}>
                <DatasetCard dataset={dataset} className="select-none" />
              </CarouselItem>
            ))}
            {seeAllHref && (
              <CarouselItem className={cardBreakpoints}>
                <DatasetCardSkeleton className="bg-muted">
                  <Button asChild className="lift" variant="gold">
                    <Link href={seeAllHref}>
                      <SearchIcon />
                      <div>See All</div>
                    </Link>
                  </Button>
                </DatasetCardSkeleton>
              </CarouselItem>
            )}
            {endCard && (
              <CarouselItem className={cardBreakpoints}>
                <DatasetCardSkeleton className="bg-muted">
                  {endCard}
                </DatasetCardSkeleton>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="max-md:hidden" />
          <CarouselNext className="max-md:hidden" />
        </Carousel>
        <CarouselScrollDots api={api} />
      </div>
    </div>
  );
}
