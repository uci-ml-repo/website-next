import { SearchIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";

import { DatasetCardCarousel } from "@/components/dataset/dataset-carousel";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const popularDatasets = await caller.dataset.find.byQuery({
    order: { viewCount: "desc" },
    limit: 15,
  });

  const newDatasets = await caller.dataset.find.byQuery({
    order: { donatedAt: "desc" },
    limit: 15,
  });

  return (
    <div className="space-y-12">
      <MLRepoLogo variant="hero" />
      <div className="blur-background space-y-12">
        <div className="bg-background relative">
          <Input
            className="h-12 py-4 pl-11 !text-xl placeholder:text-xl"
            placeholder="Search datasets"
          />
          <SearchIcon className="text-muted-foreground absolute top-3 left-3.5" />
        </div>

        <DatasetCardCarousel
          heading="Popular Datasets"
          datasets={popularDatasets}
          icon={<TrendingUpIcon />}
          seeAllHref={ROUTES.DATASET.SEARCH}
        />

        <DatasetCardCarousel
          heading="New Datasets"
          datasets={newDatasets}
          icon={<SparklesIcon />}
          seeAllHref={ROUTES.DATASET.SEARCH}
        />

        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center text-xl font-bold text-pretty">
              Didn't find what you were looking for?
            </h2>
            <Button size="lg" variant="gold" asChild>
              <Link href={ROUTES.DATASET.SEARCH}>
                <SearchIcon />
                Explore All Datasets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
