import type { Metadata } from "next";

import { DatasetSearchResults } from "@/components/dataset/search/dataset-search-results";
import { DatasetFiltersDesktop } from "@/components/dataset/search/filter/dataset-filters-desktop";
import { DatasetFiltersMobile } from "@/components/dataset/search/filter/dataset-filters-mobile";
import { DatasetFilterOrder } from "@/components/dataset/search/filter/item/dataset-filter-order";
import { DatasetFilterSearch } from "@/components/dataset/search/filter/item/dataset-filter-search";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
  alternates: { canonical: ROUTES.SEARCH() },
};

export default function Page() {
  return (
    <div className="blur-background flex space-x-6">
      <DatasetFiltersDesktop className="max-xl:hidden" />
      <div className="flex grow flex-col">
        <div className="space-y-2">
          <div className="flex items-end gap-3 max-md:flex-col">
            <div className="w-full">
              <h1 className="h-10 text-2xl font-bold">Browse datasets</h1>
              <DatasetFilterSearch />
            </div>
            <div className="flex items-end justify-between gap-x-3 max-md:w-full">
              <DatasetFiltersMobile />
              <div className="flex flex-col gap-1 max-md:flex-row max-md:items-center">
                <div className="text-muted-foreground max-2xs:hidden">Order by:</div>
                <DatasetFilterOrder />
              </div>
            </div>
          </div>

          <DatasetSearchResults />
        </div>
      </div>
    </div>
  );
}
