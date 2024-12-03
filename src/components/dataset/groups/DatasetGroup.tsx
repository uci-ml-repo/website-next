import Link from "next/link";

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
      <div className={"flex gap-4"}>
        {datasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}
