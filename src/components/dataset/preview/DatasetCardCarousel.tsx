import { SearchIcon } from "lucide-react";
import Link from "next/link";

import DatasetCard from "@/components/dataset/preview/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/preview/DatasetCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { DatasetSelect } from "@/db/types";
import { cn } from "@/lib/utils";

interface DatasetGroupProps {
  heading: string;
  icon?: React.ReactNode;
  seeAllHref?: string;
  endCard?: React.ReactNode;
  datasets: DatasetSelect[];
}

export default function DatasetCardCarousel({
  icon,
  heading,
  seeAllHref,
  endCard,
  datasets,
}: DatasetGroupProps) {
  const cardBreakpoints = cn(
    "basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4",
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon}
          <h2 className="text-2xl font-bold">{heading}</h2>
        </div>
        {seeAllHref && (
          <Button variant="link" asChild>
            <Link href={seeAllHref}>See All</Link>
          </Button>
        )}
      </div>
      <div className="max-[1600px]:mx-10">
        <Carousel opts={{ align: "start", skipSnaps: true, duration: 20 }}>
          <CarouselContent allowPadding>
            {datasets.map((dataset) => (
              <CarouselItem key={dataset.id} className={cardBreakpoints}>
                <DatasetCard dataset={dataset} />
              </CarouselItem>
            ))}
            {seeAllHref && (
              <CarouselItem className={cardBreakpoints}>
                <DatasetCardSkeleton className="bg-muted">
                  <Button asChild className="lift">
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
