import type { Metadata } from "next";

import { DatasetSearchResults } from "@/components/dataset/search/dataset-search-results";
import { DatasetFiltersDesktop } from "@/components/dataset/search/filter/dataset-filters-desktop";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
  alternates: { canonical: ROUTES.SEARCH },
};

export default function Page() {
  return (
    <div className="blur-background flex space-x-6">
      <DatasetFiltersDesktop />
      <DatasetSearchResults />
    </div>
  );
}
