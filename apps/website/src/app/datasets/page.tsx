import type { Metadata } from "next";

import { DatasetSearchResults } from "@/components/dataset/search/dataset-search-results";
import { DatasetFiltersDesktop } from "@/components/dataset/search/filter/dataset-filters-desktop";
import { DatasetFilterOrder } from "@/components/dataset/search/filter/item/dataset-filter-order";
import { DatasetFilterTitle } from "@/components/dataset/search/filter/item/dataset-filter-title";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
  alternates: { canonical: ROUTES.SEARCH() },
};

export default function Page() {
  return (
    <div className="blur-background flex space-x-6">
      <DatasetFiltersDesktop className="max-lg:hidden" />
      <div className="flex grow flex-col">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="w-full">
              <h1 className="h-10 text-2xl font-bold">Browse datasets</h1>
              <DatasetFilterTitle />
            </div>
            <div className="max-md:hidden">
              <div className="text-muted-foreground flex h-10 items-end pb-1">Order by:</div>
              <DatasetFilterOrder />
            </div>
          </div>

          <DatasetSearchResults />
        </div>
      </div>
    </div>
  );
}
