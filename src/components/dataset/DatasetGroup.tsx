"use client";

import type { Dataset } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

import DatasetCard from "@/components/dataset/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/DatasetCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DatasetGroupProps {
  heading: string;
  icon?: React.ReactNode;
  seeAllHref?: string;
  datasets: Dataset[];
}

export default function DatasetGroup({
  icon,
  heading,
  seeAllHref,
  datasets,
}: DatasetGroupProps) {
  const cardBreakpoints = cn(
    "basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4",
  );

  return (
    <div className={"space-y-4"}>
      <div className={"flex items-center justify-between"}>
        <div className={"flex items-center space-x-4"}>
          {icon && <div className={"[&_svg]:size-8"}>{icon}</div>}
          <h2 className={"text-2xl font-bold"}>{heading}</h2>
        </div>
        {seeAllHref && (
          <Button variant={"link"} asChild>
            <Link href={seeAllHref}>See All</Link>
          </Button>
        )}
      </div>
      <div className={"max-[1600px]:mx-10"}>
        <Carousel opts={{ align: "start", skipSnaps: true, duration: 20 }}>
          <CarouselContent allowPadding>
            {datasets.map((dataset, index) => (
              <CarouselItem key={index} className={cardBreakpoints}>
                <DatasetCard dataset={dataset} />
              </CarouselItem>
            ))}
            {seeAllHref && (
              <CarouselItem className={cardBreakpoints}>
                <DatasetCardSkeleton className={"bg-muted"}>
                  <Button asChild pill className={"lift"}>
                    <Link href={seeAllHref}>
                      <SearchIcon />
                      <div>See All</div>
                    </Link>
                  </Button>
                </DatasetCardSkeleton>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
