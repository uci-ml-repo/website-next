"use client";

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
import type { RouterOutput } from "@/server/trpc/routers";

interface DatasetGroupProps {
  heading: string;
  icon?: React.ReactNode;
  seeAllHref?: string;
  datasets: RouterOutput["datasets"]["find"]["datasets"];
}

export default function DatasetGroup({
  icon,
  heading,
  seeAllHref,
  datasets,
}: DatasetGroupProps) {
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
      <div className={"max-[1350px]:mx-10"}>
        <Carousel opts={{ align: "start", skipSnaps: true, duration: 20 }}>
          <CarouselContent allowPadding>
            {datasets.map((dataset, index) => (
              <CarouselItem
                key={index}
                className={"basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"}
              >
                <DatasetCard dataset={dataset} />
              </CarouselItem>
            ))}
            {seeAllHref && (
              <CarouselItem
                className={"basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"}
              >
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
