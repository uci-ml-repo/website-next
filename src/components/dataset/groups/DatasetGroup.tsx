import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import DatasetCard from "@/components/dataset/DatasetCard";
import { Button } from "@/components/ui/button";
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
  const MIN_CARD_WIDTH = 225;

  const ref = useRef<HTMLDivElement>(null);
  const [numCols, setNumCols] = useState(0);

  useEffect(() => {
    const updateNumCols = () => {
      if (ref.current) {
        const width = ref.current.clientWidth;
        setNumCols(
          Math.min(Math.floor(width / MIN_CARD_WIDTH), datasets.length),
        );
      }
    };

    updateNumCols();

    window.addEventListener("resize", updateNumCols);
    return () => {
      window.removeEventListener("resize", updateNumCols);
    };
  }, [datasets.length]);

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
        className={`grid gap-4`}
        style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        ref={ref}
      >
        {datasets.slice(0, numCols).map((dataset, index) => (
          <DatasetCard key={index} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}
