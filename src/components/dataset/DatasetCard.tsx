import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { datasetHref, datasetThumbnail } from "@/lib/utils";
import type { RouterOutput } from "@/server/trpc/routers";

interface DatasetCardProps {
  dataset: RouterOutput["datasets"]["find"]["datasets"][number];
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  const thumbnail = datasetThumbnail(dataset);
  const href = datasetHref(dataset);

  return (
    <Card className="lift w-[300px]">
      <Link href={href}>
        <CardHeader className={"p-0"}>
          <Image
            src={thumbnail}
            alt={"thumbnail"}
            width={350}
            height={100}
            className={"z-10 h-[100px] rounded-t-xl object-cover object-center"}
          />
        </CardHeader>
        <CardContent className={"space-y-2"}>
          <CardTitle className={"line-clamp-2"}>{dataset.title}</CardTitle>
          <CardDescription className={"line-clamp-3"}>
            {dataset.subtitle ?? dataset.abstract}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Link>
    </Card>
  );
}
