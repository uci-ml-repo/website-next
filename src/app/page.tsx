import {
  ListIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import DatasetCardCarousel from "@/components/dataset/preview/DatasetCardCarousel";
import { Banner } from "@/components/icons";
import Main from "@/components/layout/Main";
import DatasetSearchInput from "@/components/search/DatasetSearchInput";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { CONTRIBUTE_PATH, DATASETS_PATH } from "@/lib/routes";
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
            href={DATASETS_PATH}
          />
          <NavButton
            label="Contribute Dataset"
            variant="secondary"
            icon={<PlusIcon />}
            href={CONTRIBUTE_PATH}
          />
        </div>
        <DatasetSearchInput />
      </div>

      <div className="space-y-10">
        <DatasetCardCarousel
          icon={<TrendingUpIcon className="size-8" />}
          heading="Popular Datasets"
          seeAllHref={DATASETS_PATH} // TODO
          datasets={popularDatasets.datasets}
        />
        <hr />
        <DatasetCardCarousel
          icon={<SparklesIcon className="size-8" />}
          heading="New Datasets"
          seeAllHref={DATASETS_PATH} // TODO
          datasets={newDatasets.datasets}
        />
        <hr />
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-pretty text-center text-xl font-bold">
              Didn't find what you were looking for?
            </p>
            <Button asChild className="lift" size="lg">
              <div>
                <SearchIcon />
                <Link href={DATASETS_PATH}>Explore All Datasets</Link>
              </div>
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
