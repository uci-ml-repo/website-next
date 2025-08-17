"use client";

import { SparklesIcon } from "lucide-react";

import { DatasetCardCarousel } from "@/components/dataset/carousel/dataset-carousel";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function DatasetCarouselNew() {
  const { data } = trpc.dataset.find.byQuery.useQuery({
    order: { donatedAt: "desc" },
    limit: 15,
  });

  return (
    <DatasetCardCarousel
      heading="New Datasets"
      datasets={data?.datasets}
      icon={<SparklesIcon />}
      seeAllHref={ROUTES.SEARCH({ order: { donatedAt: "desc" } })}
    />
  );
}
