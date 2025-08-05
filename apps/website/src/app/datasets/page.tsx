import type { Metadata } from "next";

import { DataSearchResults } from "@/components/dataset/search/data-search-results";
import { DatasetSearchFiltersDesktop } from "@/components/dataset/search/filter/dataset-search-filters-desktop";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
  alternates: { canonical: ROUTES.SEARCH },
};

export default function Page() {
  return (
    <div className="blur-background flex space-x-6">
      <DatasetSearchFiltersDesktop className="max-lg:hidden" />
      <DataSearchResults />
    </div>
  );
}
