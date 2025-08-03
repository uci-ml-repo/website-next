import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { NewDatasetsCarousel } from "@/components/dataset/dataset-carousel/new-datasets-carousel";
import { PopularDatasetsCarousel } from "@/components/dataset/dataset-carousel/popular-datasets-carousel";
import { QuickSearch } from "@/components/dataset/search/quick-search";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function Page() {
  return (
    <div className="space-y-10">
      <MLRepoLogo variant="hero" />

      <div className="blur-background space-y-16">
        <div className="space-y-10">
          <QuickSearch />
          <PopularDatasetsCarousel />
          <NewDatasetsCarousel />
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center text-xl font-bold text-pretty">
              Didn't find what you were looking for?
            </h2>
            <Button size="lg" variant="gold" asChild>
              <Link href={ROUTES.SEARCH}>
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
