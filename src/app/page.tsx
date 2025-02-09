import {
  ListIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { DatasetCardCarousel } from "@/components/dataset/preview/DatasetCardCarousel";
import { DatasetsPreviewSearch } from "@/components/datasets/DatasetsPreviewSearch";
import { Banner } from "@/components/icons";
import { Main } from "@/components/layout/Main";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { CONTRIBUTE_ROUTE, DATASETS_QUERY, DATASETS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const datasetCount = await caller.dataset.count.approved();

  const popularDatasets = await caller.dataset.find.byQuery({
    order: { viewCount: "desc" },
    limit: 10,
  });
  const newDatasets = await caller.dataset.find.byQuery({
    order: { donatedAt: "desc" },
    limit: 10,
  });

  return (
    <Main className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Banner variant="hero" />
          <p className="text-pretty text-lg sm:text-xl">
            We currently maintain {datasetCount[0].count} datasets used by
            millions in the machine learning community.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <NavButton
            label="Explore All Datasets"
            variant="blue"
            icon={<ListIcon />}
            href={DATASETS_ROUTE}
          />
          <NavButton
            label="Contribute Dataset"
            variant="secondary"
            icon={<PlusIcon />}
            href={CONTRIBUTE_ROUTE}
          />
        </div>
        <DatasetsPreviewSearch />
      </div>

      <div className="space-y-12">
        <DatasetCardCarousel
          icon={<TrendingUpIcon />}
          heading="Popular Datasets"
          seeAllHref={DATASETS_QUERY({ order: { viewCount: "desc" } })}
          datasets={popularDatasets.datasets}
        />
        <DatasetCardCarousel
          icon={<SparklesIcon />}
          heading="New Datasets"
          seeAllHref={DATASETS_QUERY({ order: { donatedAt: "desc" } })}
          datasets={newDatasets.datasets}
        />
        <hr />
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-pretty text-center text-xl font-bold">
              Didn't find what you were looking for?
            </h2>
            <Button className="lift" size="lg" variant="gold" asChild>
              <Link href={DATASETS_ROUTE}>
                <SearchIcon />
                Explore All Datasets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Main>
  );
}

function NavButton({
  label,
  variant,
  icon,
  href,
}: {
  label: string;
  variant: ButtonProps["variant"];
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Button
      variant={variant}
      size="lg"
      className="lift w-full sm:w-fit"
      asChild
    >
      <Link href={href}>
        {icon}
        {label}
      </Link>
    </Button>
  );
}
