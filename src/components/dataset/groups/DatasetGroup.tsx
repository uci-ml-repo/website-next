import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import DatasetCard from "@/components/dataset/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/DatasetCardSkeleton";
import { Button } from "@/components/ui/button";
import type { RouterOutput } from "@/server/trpc/routers";

interface DatasetGroupProps {
  heading: string;
  icon?: React.ReactNode;
  seeAllHref?: string;
  datasets: RouterOutput["datasets"]["find"]["datasets"] | undefined;
}

export default function DatasetGroup({
  icon,
  heading,
  seeAllHref,
  datasets,
}: DatasetGroupProps) {
  const CONTENT_WIDTH = 1250;
  const MIN_CARD_WIDTH = 225;

  const calculateNumCols = useCallback(
    () =>
      Math.min(
        Math.floor(Math.min(window.innerWidth, CONTENT_WIDTH) / MIN_CARD_WIDTH),
        datasets ? datasets.length : 4,
      ),
    [datasets],
  );

  const [numCols, setNumCols] = useState(calculateNumCols);

  useEffect(() => {
    const handleResize = () => setNumCols(calculateNumCols());

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateNumCols, datasets]);

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
      <div
        className={`grid h-[360px] gap-4`}
        style={{
          gridTemplateColumns:
            numCols > 0 ? `repeat(${numCols}, minmax(0, 1fr))` : undefined,
        }}
      >
        {datasets
          ? datasets
              .slice(0, numCols)
              .map((dataset, index) => (
                <DatasetCard key={index} dataset={dataset} />
              ))
          : Array(numCols)
              .fill(null)
              .map((_, index) => <DatasetCardSkeleton key={index} />)}
      </div>
    </div>
  );
}
