import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { DatasetCarouselNew } from "@/components/dataset/carousel/dataset-carousel-new";
import { DatasetCarouselPopular } from "@/components/dataset/carousel/dataset-carousel-popular";
import { DatasetQuickSearch } from "@/components/dataset/search/dataset-quick-search";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function Page() {
  return (
    <div className="space-y-10">
      <MLRepoLogo variant="hero" />

      <div className="blur-background space-y-12">
        <div className="space-y-10">
          <DatasetQuickSearch />
          <DatasetCarouselPopular />
          <DatasetCarouselNew />
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center text-xl font-bold text-pretty">
              Didn't find what you were looking for?
            </h2>
            <Button size="lg" variant="gold" asChild>
              <Link href={ROUTES.SEARCH()}>
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
