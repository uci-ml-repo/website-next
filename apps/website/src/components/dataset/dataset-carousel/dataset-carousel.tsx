"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { DatasetCard } from "@/components/dataset/dataset-card/dataset-card";
import { DatasetCardSkeleton } from "@/components/dataset/dataset-card/dataset-card-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
} from "@/components/ui/carousel";
import { cn } from "@/lib/util/cn";
import type { DatasetSelect } from "@/server/types/dataset/response";

interface Props {
  heading: string;
  datasets?: DatasetSelect[];
  icon?: ReactNode;
  seeAllHref?: string;
}

export function DatasetCardCarousel({ icon, heading, seeAllHref, datasets }: Props) {
  const [api, setApi] = useState<CarouselApi>();

  const cardBreakpoints = cn(
    "@9xl:basis-1/6 @8xl:basis-1/5 basis-full @md:basis-1/2 @2xl:basis-1/3 @5xl:basis-1/4",
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
            <Link href={seeAllHref} passHref>
              See All
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-4 max-2xl:mx-10 max-md:mx-0">
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
            {datasets
              ? datasets.map((dataset) => (
                  <CarouselItem key={dataset.id} className={cardBreakpoints}>
                    <DatasetCard dataset={dataset} className="select-none" />
                  </CarouselItem>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <CarouselItem key={i} className={cardBreakpoints}>
                    <DatasetCardSkeleton className="select-none" />
                  </CarouselItem>
                ))}
            {seeAllHref && (
              <CarouselItem className={cardBreakpoints}>
                <Card className="flex h-(--dataset-card-height) w-full items-center justify-center">
                  <Button className="lift" variant="gold" asChild tabIndex={-1}>
                    <Link href={seeAllHref}>
                      <SearchIcon />
                      <div>See All</div>
                    </Link>
                  </Button>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="max-md:hidden" />
          <CarouselNext className="max-md:hidden" />
        </Carousel>
        {datasets ? <CarouselScrollDots api={api} /> : <div className="h-4" />}
      </div>
    </div>
  );
}
