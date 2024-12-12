"use client";

import { TrendingUpIcon } from "lucide-react";

import DatasetGroup from "@/components/dataset/groups/DatasetGroup";
import { trpc } from "@/server/trpc/client";

export default function PopularDatasets() {
  const datasetsQuery = trpc.datasets.find.useQuery({
    orderBy: "viewCount",
    sort: "desc",
    take: 4,
  });

  return (
    <DatasetGroup
      icon={<TrendingUpIcon />}
      heading={"Popular Datasets"}
      seeAllHref={"#"}
      datasets={datasetsQuery.data?.datasets}
    />
  );
}
