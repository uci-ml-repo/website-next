"use client";

import { TrendingUpIcon } from "lucide-react";

import { DatasetCardCarousel } from "@/components/dataset/dataset-carousel/dataset-carousel";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function NewDatasetsCarousel() {
  const { data: popularDatasets } = trpc.dataset.find.byQuery.useQuery({
    order: { donatedAt: "desc" },
    limit: 15,
  });

  return (
    <DatasetCardCarousel
      heading="Popular Datasets"
      datasets={popularDatasets}
      icon={<TrendingUpIcon />}
      seeAllHref={ROUTES.SEARCH}
    />
  );
}
