"use client";

import { SparklesIcon } from "lucide-react";

import DatasetGroup from "@/components/dataset/groups/DatasetGroup";
import { trpc } from "@/server/trpc/client";

export default function NewDatasets() {
  const datasetsQuery = trpc.datasets.find.useQuery({
    orderBy: "donatedAt",
    take: 4,
    sort: "desc",
  });

  return (
    <DatasetGroup
      icon={<SparklesIcon />}
      heading={"New Datasets"}
      seeAllHref={"#"}
      datasets={datasetsQuery.data?.datasets}
    />
  );
}
