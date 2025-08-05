"use client";

import { TrendingUpIcon } from "lucide-react";

import { DatasetCardCarousel } from "@/components/dataset/dataset-carousel/dataset-carousel";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function PopularDatasetsCarousel() {
  const { data } = trpc.dataset.find.byQuery.useQuery({
    order: { viewCount: "desc" },
    limit: 15,
  });

  return (
    <DatasetCardCarousel
      heading="Popular Datasets"
      datasets={data?.datasets}
      icon={<TrendingUpIcon />}
      seeAllHref={ROUTES.SEARCH}
    />
  );
}
